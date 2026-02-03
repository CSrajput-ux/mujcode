const { Worker } = require('bullmq');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const Submission = require('../models/mongo/Submission');
const Problem = require('../models/mongo/Problem');

const connection = { host: '127.0.0.1', port: 6379 };

// 🔥 LANGUAGE CONFIGURATION MAP
const LANGUAGE_CONFIG = {
    'c': { image: 'gcc:latest', fileName: 'main.c', compile: 'gcc /app/main.c -o /app/output', run: '/app/output', hasInput: true },
    'cpp': { image: 'gcc:latest', fileName: 'main.cpp', compile: 'g++ /app/main.cpp -o /app/output', run: '/app/output', hasInput: true },
    'python': { image: 'python:3.9-slim', fileName: 'main.py', run: 'python /app/main.py', hasInput: true },
    'java': { image: 'eclipse-temurin:17-jdk-alpine', fileName: 'Main.java', compile: 'javac /app/Main.java', run: 'java -cp /app Main', hasInput: true },
    'javascript': { image: 'node:18-alpine', fileName: 'main.js', run: 'node /app/main.js', hasInput: true },
    'go': { image: 'golang:alpine', fileName: 'main.go', run: 'go run /app/main.go', hasInput: true },
    'rust': { image: 'rust:alpine', fileName: 'main.rs', compile: 'rustc /app/main.rs -o /app/output', run: '/app/output', hasInput: true },
    'bash': { image: 'bash:latest', fileName: 'script.sh', run: 'bash /app/script.sh', hasInput: true },
    'sql': { image: 'keinos/sqlite3', fileName: 'query.sql', run: 'sqlite3 < /app/query.sql', hasInput: false }
};

// --- HELPER FUNCTION: Docker mein code run karne ke liye ---
const runDockerContainer = (tempDir, langConfig, inputContent) => {
    return new Promise((resolve, reject) => {
        // 1. Input File Write karo
        const inputPath = path.join(tempDir, 'input.txt');
        fs.writeFileSync(inputPath, inputContent || '');

        // 2. Docker Command Banao
        const runPart = langConfig.hasInput ? `${langConfig.run} < /app/input.txt` : langConfig.run;
        let dockerCmd;

        if (langConfig.compile) {
            dockerCmd = `docker run --rm --network none -v "${tempDir}:/app" ${langConfig.image} sh -c "${langConfig.compile} && ${runPart}"`;
        } else {
            dockerCmd = `docker run --rm --network none -v "${tempDir}:/app" ${langConfig.image} sh -c "${runPart}"`;
        }

        // 3. Execute with timeout
        exec(dockerCmd, { timeout: 10000 }, (error, stdout, stderr) => {
            if (error && error.killed) {
                resolve({ status: 'TLE', output: 'Time Limit Exceeded (10s)' });
            } else if (error || stderr) {
                // Agar output khali hai aur stderr hai, tabhi error maano
                if (stderr && !stdout) {
                    resolve({ status: 'Error', output: stderr });
                } else {
                    // Kuch languages stderr me warnings bhejte hain par output sahi hota hai
                    resolve({ status: 'Success', output: stdout.trim() });
                }
            } else {
                resolve({ status: 'Success', output: stdout.trim() });
            }
        });
    });
};

// --- MAIN WORKER ---
const worker = new Worker('submissionQueue', async (job) => {
    const { code, language, problemId, submissionId, mode, userInput } = job.data;
    console.log(`📝 Job: ${job.id} | Mode: ${mode || 'submit'} | Lang: ${language}`);

    // Setup Temp Directory
    const tempDir = path.join(__dirname, '../../temp', `${submissionId}`);
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    try {
        // 1. Validate Language
        const langConfig = LANGUAGE_CONFIG[language.toLowerCase()];
        if (!langConfig) throw new Error(`Language '${language}' not supported`);

        // 2. Fetch Problem
        const problem = await Problem.findById(problemId);
        if (!problem) throw new Error("Problem not found");

        // 3. Write Code File (Once)
        fs.writeFileSync(path.join(tempDir, langConfig.fileName), code);

        let finalVerdict = 'Accepted';
        let finalOutput = '';

        // --- MODE 1: RUN (Sirf user input par chalao) ---
        if (mode === 'run') {
            console.log('🏃 Running in TEST mode with custom input...');
            const inputToRun = userInput || (problem.testCases[0] ? problem.testCases[0].input : '');
            const result = await runDockerContainer(tempDir, langConfig, inputToRun);

            finalVerdict = result.status === 'Success' ? 'Run Successful' : result.status;
            finalOutput = result.output;
        }

        // --- MODE 2: SUBMIT (Saare test cases par chalao) ---
        else {
            console.log('✅ Running in SUBMIT mode - testing all cases...');

            if (!problem.testCases || problem.testCases.length === 0) {
                throw new Error("No test cases found for this problem");
            }

            // Loop through ALL test cases
            for (let i = 0; i < problem.testCases.length; i++) {
                const testCase = problem.testCases[i];
                console.log(`  Test Case ${i + 1}/${problem.testCases.length}...`);

                const result = await runDockerContainer(tempDir, langConfig, testCase.input);

                // Check for errors
                if (result.status !== 'Success') {
                    finalVerdict = result.status; // TLE or Error
                    finalOutput = `Failed at Test Case ${i + 1}: ${result.output}`;
                    break;
                }

                // Check output match
                if (result.output !== testCase.output.trim()) {
                    finalVerdict = 'Wrong Answer';
                    finalOutput = `Failed at Test Case ${i + 1}\nExpected: ${testCase.output}\nGot: ${result.output}`;
                    break;
                }
            }

            // If loop completes without breaking, all test cases passed
            if (finalVerdict === 'Accepted') {
                finalOutput = `All ${problem.testCases.length} test cases passed!`;
            }
        }

        // 4. Update Database
        await Submission.findByIdAndUpdate(submissionId, {
            verdict: finalVerdict,
            output: finalOutput
        });

        console.log(`✅ Job Complete | Verdict: ${finalVerdict}`);

    } catch (err) {
        console.error("❌ Worker Error:", err.message);
        await Submission.findByIdAndUpdate(submissionId, {
            verdict: 'System Error',
            output: err.message
        });
    } finally {
        // Cleanup temp files
        try {
            fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (e) {
            console.error("Cleanup Error:", e.message);
        }
    }

}, { connection });

console.log("🚀 Multi-Language Worker (Run + Submit) is Running...");

module.exports = worker;