// File: src/services/queueService.js
// Simplified version without Redis for development

const Submission = require('../models/mongo/Submission');
const Problem = require('../models/mongo/Problem');
const StudentProgress = require('../models/mongo/StudentProgress');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Language configurations
const LANGUAGE_CONFIG = {
    'c': { image: 'gcc:latest', fileName: 'main.c', compile: 'gcc /app/main.c -o /app/output', run: '/app/output', hasInput: true },
    'cpp': { image: 'gcc:latest', fileName: 'main.cpp', compile: 'g++ /app/main.cpp -o /app/output', run: '/app/output', hasInput: true },
    'python': { image: 'python:3.9-slim', fileName: 'main.py', run: 'python /app/main.py', hasInput: true },
    'java': { image: 'eclipse-temurin:17-jdk-alpine', fileName: 'Main.java', compile: 'javac /app/Main.java', run: 'java -cp /app Main', hasInput: true },
    'javascript': { image: 'node:18-alpine', fileName: 'main.js', run: 'node /app/main.js', hasInput: true }
};

const runDockerContainer = (tempDir, langConfig, inputContent) => {
    return new Promise((resolve, reject) => {
        const inputPath = path.join(tempDir, 'input.txt');
        fs.writeFileSync(inputPath, inputContent || '');

        const runPart = langConfig.hasInput ? `${langConfig.run} < /app/input.txt` : langConfig.run;
        let dockerCmd;

        if (langConfig.compile) {
            dockerCmd = `docker run --rm --network none -v "${tempDir}:/app" ${langConfig.image} sh -c "${langConfig.compile} && ${runPart}"`;
        } else {
            dockerCmd = `docker run --rm --network none -v "${tempDir}:/app" ${langConfig.image} sh -c "${runPart}"`;
        }

        exec(dockerCmd, { timeout: 10000 }, (error, stdout, stderr) => {
            if (error && error.killed) {
                resolve({ status: 'TLE', output: 'Time Limit Exceeded (10s)' });
            } else if (error || stderr) {
                if (stderr && !stdout) {
                    resolve({ status: 'Error', output: stderr });
                } else {
                    resolve({ status: 'Success', output: stdout.trim() });
                }
            } else {
                resolve({ status: 'Success', output: stdout.trim() });
            }
        });
    });
};

const processSubmission = async (data) => {
    const { code, language, problemId, submissionId, mode, userInput } = data;
    console.log(`📝 Processing | Mode: ${mode || 'submit'} | Lang: ${language}`);

    const tempDir = path.join(__dirname, '../../temp', `${submissionId}`);
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    try {
        const langConfig = LANGUAGE_CONFIG[language.toLowerCase()];
        if (!langConfig) throw new Error(`Language '${language}' not supported`);

        const problem = await Problem.findOne({ number: parseInt(problemId) });
        if (!problem) throw new Error("Problem not found");

        fs.writeFileSync(path.join(tempDir, langConfig.fileName), code);

        let finalVerdict = 'Accepted';
        let finalOutput = '';

        if (mode === 'run') {
            console.log('🏃 Running in TEST mode...');
            const inputToRun = userInput || (problem.testCases && problem.testCases[0] ? problem.testCases[0].input : '');
            const result = await runDockerContainer(tempDir, langConfig, inputToRun);

            finalVerdict = result.status === 'Success' ? 'Run Successful' : result.status;
            finalOutput = result.output;
        } else {
            console.log('✅ Running in SUBMIT mode...');

            if (!problem.testCases || problem.testCases.length === 0) {
                throw new Error("No test cases found");
            }

            for (let i = 0; i < problem.testCases.length; i++) {
                const testCase = problem.testCases[i];
                console.log(`  Test Case ${i + 1}/${problem.testCases.length}...`);

                const result = await runDockerContainer(tempDir, langConfig, testCase.input);

                if (result.status !== 'Success') {
                    finalVerdict = result.status;
                    finalOutput = `Failed at Test Case ${i + 1}: ${result.output}`;
                    break;
                }

                if (result.output !== testCase.output.trim()) {
                    finalVerdict = 'Wrong Answer';
                    finalOutput = `Failed at Test Case ${i + 1}\nExpected: ${testCase.output}\nGot: ${result.output}`;
                    break;
                }
            }

            if (finalVerdict === 'Accepted') {
                finalOutput = `All ${problem.testCases.length} test cases passed!`;

                // Award points and update student progress
                console.log('🎉 Awarding points and updating progress...');
                try {
                    const pointsMap = { Easy: 5, Medium: 7, Hard: 10 };
                    const points = pointsMap[problem.difficulty] || 0;

                    // Get userId from submission data
                    const { userId } = data;
                    if (userId) {
                        let progress = await StudentProgress.findOne({ userId: parseInt(userId) });

                        if (!progress) {
                            // Create new progress document
                            progress = new StudentProgress({
                                userId: parseInt(userId),
                                solvedProblems: { easy: 0, medium: 0, hard: 0 },
                                totalSolved: 0,
                                totalPoints: 0,
                                solvedProblemIds: [],
                                submissions: [],
                                activityMap: []
                            });
                        }

                        // Add solved problem (includes duplicate check)
                        await progress.addSolvedProblem(
                            problem._id,
                            problem.difficulty.toLowerCase(),
                            parseInt(problemId),
                            points
                        );

                        console.log(`✅ Progress updated! +${points} points | Total: ${progress.totalPoints}`);
                    }
                } catch (progressErr) {
                    console.error('⚠️  Progress update failed:', progressErr.message);
                    // Don't fail the submission if progress update fails
                }
            }
        }

        await Submission.findByIdAndUpdate(submissionId, {
            verdict: finalVerdict,
            output: finalOutput
        });

        console.log(`✅ Complete | Verdict: ${finalVerdict}`);

    } catch (err) {
        console.error("❌ Processing Error:", err.message);
        await Submission.findByIdAndUpdate(submissionId, {
            verdict: 'System Error',
            output: err.message
        });
    } finally {
        try {
            fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (e) {
            console.error("Cleanup Error:", e.message);
        }
    }
};

const addSubmissionToQueue = async (data) => {
    try {
        console.log(`📝 Submission queued: ${data.submissionId}`);

        // Process asynchronously
        setImmediate(async () => {
            try {
                await processSubmission(data);
            } catch (error) {
                console.error('Error processing submission:', error);
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Queue service error:', error);
        throw error;
    }
};

module.exports = { addSubmissionToQueue };