const { Worker } = require('bullmq');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose'); // Added mongoose
require('dotenv').config({ path: path.join(__dirname, '../../.env') }); // Load env vars

// Helper to connect to Mongo in this worker process
const connectMongo = async () => {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`✅ MongoDB Connected (Submission Worker ${process.pid})`);
    } catch (err) {
        console.error('❌ MongoDB Connection Error in Worker:', err);
    }
};
connectMongo();

const Submission = require('../models/mongo/Submission');
const Problem = require('../models/mongo/Problem');
const StudentProgress = require('../models/mongo/StudentProgress');
// const Activity = require('../models/mongo/Activity'); // Abstraction via Service
const activityService = require('../services/activityService');
const pLimit = require('p-limit');

const connection = { host: process.env.REDIS_HOST || '127.0.0.1', port: process.env.REDIS_PORT || 6379 };

// 🔥 LANGUAGE CONFIGURATION MAP
// 🔥 LANGUAGE CONFIGURATION MAP
const LANGUAGE_CONFIG = {
    'c': {
        image: 'gcc:latest',
        fileName: 'main.c',
        compile: 'gcc /app/main.c -o /app/output',
        run: '/app/output',
        hasInput: true
    },
    'cpp': {
        image: 'gcc:latest',
        fileName: 'main.cpp',
        compile: 'g++ /app/main.cpp -o /app/output',
        run: '/app/output',
        hasInput: true
    },
    'python': {
        image: 'python:3.9-slim',
        fileName: 'main.py',
        run: 'python3 -u /app/main.py',
        hasInput: true
    },
    'java': {
        image: 'eclipse-temurin:17-jdk-alpine', // Fixed: openjdk is deprecated
        fileName: 'Main.java',
        compile: 'javac /app/Main.java',
        run: 'java -cp /app Main',
        hasInput: true
    },
    'javascript': {
        image: 'node:18-alpine',
        fileName: 'main.js',
        run: 'node /app/main.js',
        hasInput: true
    },
    'go': {
        image: 'golang:alpine',
        fileName: 'main.go',
        compile: 'go build -o /app/output /app/main.go', // Added explicit compile step for Go
        run: '/app/output',
        hasInput: true
    },
    'rust': {
        image: 'rust:alpine',
        fileName: 'main.rs',
        compile: 'rustc /app/main.rs -o /app/output',
        run: '/app/output',
        hasInput: true
    },
    'bash': {
        image: 'bash:latest',
        fileName: 'script.sh',
        run: 'bash /app/script.sh',
        hasInput: true
    },
    'sql': {
        image: 'keinos/sqlite3',
        fileName: 'query.sql',
        run: 'sqlite3 < /app/query.sql',
        hasInput: false
    }
};

// --- HELPER: Execute Docker Command ---
const executeDocker = (cmd, timeout = 10000) => {
    return new Promise((resolve) => {
        exec(cmd, { timeout }, (error, stdout, stderr) => {
            if (error && error.killed) {
                resolve({ status: 'TLE', output: 'Time Limit Exceeded' });
            } else if (error || (stderr && !stdout)) {
                // Determine if it's a runtime error or just stderr warning
                const outputErr = stderr || error.message;
                // Special handling for Java missing main method
                if (outputErr.includes('Main method not found')) {
                    resolve({ status: 'Error', output: 'Error: Main method not found in class Main. Please ensure your code has a public static void main(String[] args) method.' });
                } else {
                    resolve({ status: 'Error', output: outputErr });
                }
            } else {
                resolve({ status: 'Success', output: stdout.trim() });
            }
        });
    });
};

// --- HELPER: Compile Code (Once) ---
const compileCode = async (tempDir, langConfig) => {
    if (!langConfig.compile) return { status: 'Success' }; // No compilation needed

    // Security Hardening: Drop capabilities, limit PIDs, no privilege escalation
    const compileCmd = `docker run --rm --memory=256m --memory-swap=256m --cpus=1.0 --pids-limit=100 --cap-drop=ALL --security-opt=no-new-privileges --network none -v "${tempDir}:/app" ${langConfig.image} sh -c "${langConfig.compile}"`;
    return await executeDocker(compileCmd, 10000); // 10s max for compilation
};

// --- HELPER: Run Test Case ---
const runTestCase = async (tempDir, langConfig, inputContent) => {
    const inputId = Math.random().toString(36).substring(7); // Unique ID for parallel files
    const inputFileName = `input_${inputId}.txt`;
    const inputPath = path.join(tempDir, inputFileName);

    fs.writeFileSync(inputPath, inputContent || '');

    const runPart = langConfig.hasInput ? `${langConfig.run} < /app/${inputFileName}` : langConfig.run;

    // Security Hardening: Strict limits for execution
    const dockerCmd = `docker run --rm --memory=128m --memory-swap=128m --cpus=0.5 --pids-limit=50 --cap-drop=ALL --security-opt=no-new-privileges --network none -v "${tempDir}:/app" ${langConfig.image} sh -c "${runPart}"`;

    const result = await executeDocker(dockerCmd, 5000); // 5s max per test case

    // Cleanup individual input file (async, don't await)
    // await fs.promises.unlink(inputPath).catch(() => {});
    fs.unlink(inputPath, () => { });

    return result;
};

// --- MAIN WORKER ---
const worker = new Worker('submissionQueue', async (job) => {
    const { code, language, problemId, userId, submissionId, mode, userInput } = job.data;
    console.log(`📝 Job: ${job.id} | Mode: ${mode || 'submit'} | Lang: ${language}`);

    // Global Job Timeout Enforcer
    const JOB_TIMEOUT_MS = 20000;
    const jobStartTime = Date.now();
    let isTimedOut = false;

    // Setup Temp Directory
    let tempDir = path.join(__dirname, '../../temp', `${submissionId}`);
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    // Normalize for Windows Docker (Source: C:\path -> /c/path or just basic forward slash conversion)
    // Most Docker Desktop for Windows setups handle standard paths if backslashes are escaped or converted to forward slashes.
    // Safe approach: Convert backslashes to forward slashes.
    tempDir = tempDir.replace(/\\/g, '/');

    try {
        const langConfig = LANGUAGE_CONFIG[language.toLowerCase()];
        if (!langConfig) throw new Error(`Language '${language}' not supported`);

        // SMART LOOKUP: Check if ID is numeric (Problem Number) or ObjectId
        let problem;
        if (!isNaN(problemId)) {
            problem = await Problem.findOne({ number: problemId });
        }
        if (!problem && mongoose.Types.ObjectId.isValid(problemId)) {
            problem = await Problem.findById(problemId);
        }
        if (!problem) throw new Error("Problem not found");

        // Write Code File
        fs.writeFileSync(path.join(tempDir, langConfig.fileName), code);

        // 1. COMPILE (Once)
        console.log('🔨 Compiling...');
        const compileResult = await compileCode(tempDir, langConfig);

        // Check timeout after compilation
        if (Date.now() - jobStartTime > JOB_TIMEOUT_MS) {
            throw new Error(`Time Limit Exceeded (Total time > ${JOB_TIMEOUT_MS / 1000}s)`);
        }

        if (compileResult.status !== 'Success') {
            console.log('❌ Compilation Failed');
            await Submission.findByIdAndUpdate(submissionId, {
                verdict: 'Compilation Error',
                output: compileResult.output
            });
            return; // Stop execution
        }

        let finalVerdict = 'Accepted';
        let finalOutput = '';
        let passedCount = 0;
        let totalCount = 0;

        // 2. RUN (Parallel Execution)
        if (mode === 'run') {
            const inputToRun = userInput || (problem.testCases[0] ? problem.testCases[0].input : '');
            console.log('🏃 Running Test (Run Mode)...');
            const result = await runTestCase(tempDir, langConfig, inputToRun);

            finalVerdict = result.status === 'Success' ? 'Run Successful' : result.status;
            finalOutput = result.output;
            passedTestCases = result.status === 'Success' ? 1 : 0;
            totalTestCases = 1;
        }
        else {
            const limit = pLimit(5); // Limit to 5 concurrent containers

            // Create promises for all test cases
            const testPromises = problem.testCases.map((testCase, index) => {
                return limit(() => runTestCase(tempDir, langConfig, testCase.input)
                    .then(result => ({ ...result, index, testCase })));
            });

            // Wait for ALL to finish (or fail)
            const results = await Promise.all(testPromises);

            // Check if global timeout exceeded during execution
            if (Date.now() - jobStartTime > JOB_TIMEOUT_MS) {
                throw new Error(`Time Limit Exceeded (Total time > ${JOB_TIMEOUT_MS / 1000}s)`);
            }

            // Analyze results
            const failedTest = results.find(r => {
                if (r.status !== 'Success') return true;
                if (r.output !== r.testCase.output.trim()) return true;
                return false;
            });

            if (failedTest) {
                if (failedTest.status !== 'Success') {
                    finalVerdict = failedTest.status; // TLE or Error
                    finalOutput = `Failed at Test Case ${failedTest.index + 1}: ${failedTest.output}`;
                } else {
                    finalVerdict = 'Wrong Answer';
                    finalOutput = `Failed at Test Case ${failedTest.index + 1}\nExpected: ${failedTest.testCase.output}\nGot: ${failedTest.output}`;
                }
            } else {
                finalOutput = `All ${problem.testCases.length} test cases passed!`;
            }

            // Calculate Stats
            totalCount = problem.testCases.length;
            passedCount = results.filter(r => r.status === 'Success' && r.output.trim() === r.testCase.output.trim()).length;
        }

        // 3. Update DB
        // 3. Update DB (Submission)
        await Submission.findByIdAndUpdate(submissionId, {
            verdict: finalVerdict,
            output: finalOutput,
            passedTestCases: passedCount,
            totalTestCases: totalCount,
            executionTime: Date.now() - jobStartTime,
            memoryUsed: 0 // Placeholder, requires advanced Docker stats
        });

        // 4. Update Student Progress & Activity (If Accepted)
        if (finalVerdict === 'Accepted' && mode === 'submit') {
            try {
                let progress = await StudentProgress.findOne({ userId });
                if (!progress) {
                    progress = new StudentProgress({ userId });
                }

                await progress.addSolvedProblem(
                    problem._id,
                    problem.difficulty.toLowerCase(),
                    problem.number,
                    problem.points
                );

                // Log Activity for Heatmap
                await activityService.logActivity(userId);

                console.log(`📈 Updated Progress for User ${userId}`);
            } catch (progErr) {
                console.error(`⚠️ Failed to update progress: ${progErr.message}`);
            }
        }

        console.log(`✅ Job Complete | Verdict: ${finalVerdict}`);

    } catch (err) {
        console.error("❌ Worker Error:", err.message);
        const verdict = err.message.includes('Time Limit Exceeded') ? 'Time Limit Exceeded' : 'System Error';
        await Submission.findByIdAndUpdate(submissionId, {
            verdict: verdict,
            output: err.message
        });
    } finally {
        try {
            fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (e) { }
    }

}, { connection });

worker.on('completed', job => {
    console.log(`✅ Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`❌ Job ${job.id} has failed with ${err.message}`);
});

worker.on('error', err => {
    console.error(`❌ Worker Connection Error: ${err.message}`);
});

console.log("🚀 Optimized Multi-Language Worker (Parallel + 20s Limit) is Running...");

module.exports = worker;