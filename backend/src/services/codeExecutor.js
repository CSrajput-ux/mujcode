const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class CodeExecutor {
    constructor() {
        this.tempDir = path.join(__dirname, '../../temp/code-execution');
        this.ensureTempDir();
    }

    async ensureTempDir() {
        try {
            await fs.mkdir(this.tempDir, { recursive: true });
        } catch (error) {
            console.error('Error creating temp directory:', error);
        }
    }

    async executeCode({ language, code, input, timeLimit = 5, memoryLimit = 256 }) {
        const executionId = uuidv4();
        const workDir = path.join(this.tempDir, executionId);

        try {
            // Create working directory
            await fs.mkdir(workDir, { recursive: true });

            // Execute based on language
            let result;
            switch (language) {
                case 'python':
                    result = await this.executePython(code, input, workDir, timeLimit, memoryLimit);
                    break;
                case 'java':
                    result = await this.executeJava(code, input, workDir, timeLimit, memoryLimit);
                    break;
                case 'cpp':
                    result = await this.executeCpp(code, input, workDir, timeLimit, memoryLimit);
                    break;
                case 'c':
                    result = await this.executeC(code, input, workDir, timeLimit, memoryLimit);
                    break;
                case 'javascript':
                    result = await this.executeJavaScript(code, input, workDir, timeLimit, memoryLimit);
                    break;
                default:
                    throw new Error(`Unsupported language: ${language}`);
            }

            return result;
        } catch (error) {
            return {
                success: false,
                output: '',
                error: error.message,
                executionTime: 0
            };
        } finally {
            // Cleanup
            await this.cleanup(workDir);
        }
    }

    async executePython(code, input, workDir, timeLimit, memoryLimit) {
        const codeFile = path.join(workDir, 'solution.py');
        const inputFile = path.join(workDir, 'input.txt');

        await fs.writeFile(codeFile, code);
        await fs.writeFile(inputFile, input || '');

        // Docker command with resource limits
        const dockerCmd = `docker run --rm \
            --network none \
            --memory="${memoryLimit}m" \
            --cpus="1.0" \
            --pids-limit 50 \
            -v "${workDir}:/workspace" \
            -w /workspace \
            python:3.11-alpine \
            timeout ${timeLimit}s python solution.py < input.txt`;

        return await this.runCommand(dockerCmd, timeLimit);
    }

    async executeJava(code, input, workDir, timeLimit, memoryLimit) {
        const codeFile = path.join(workDir, 'Solution.java');
        const inputFile = path.join(workDir, 'input.txt');

        await fs.writeFile(codeFile, code);
        await fs.writeFile(inputFile, input || '');

        // Compile first
        const compileCmd = `docker run --rm \
            -v "${workDir}:/workspace" \
            -w /workspace \
            openjdk:11-slim \
            javac Solution.java`;

        const compileResult = await this.runCommand(compileCmd, 10);

        if (!compileResult.success) {
            return {
                success: false,
                output: '',
                error: `Compilation Error:\n${compileResult.error}`,
                executionTime: 0
            };
        }

        // Execute
        const runCmd = `docker run --rm \
            --network none \
            --memory="${memoryLimit}m" \
            --cpus="1.0" \
            -v "${workDir}:/workspace" \
            -w /workspace \
            openjdk:11-slim \
            timeout ${timeLimit}s java Solution < input.txt`;

        return await this.runCommand(runCmd, timeLimit);
    }

    async executeCpp(code, input, workDir, timeLimit, memoryLimit) {
        const codeFile = path.join(workDir, 'solution.cpp');
        const inputFile = path.join(workDir, 'input.txt');
        const binaryFile = path.join(workDir, 'solution');

        await fs.writeFile(codeFile, code);
        await fs.writeFile(inputFile, input || '');

        // Compile
        const compileCmd = `docker run --rm \
            -v "${workDir}:/workspace" \
            -w /workspace \
            gcc:latest \
            g++ -o solution solution.cpp -std=c++17`;

        const compileResult = await this.runCommand(compileCmd, 10);

        if (!compileResult.success) {
            return {
                success: false,
                output: '',
                error: `Compilation Error:\n${compileResult.error}`,
                executionTime: 0
            };
        }

        // Execute
        const runCmd = `docker run --rm \
            --network none \
            --memory="${memoryLimit}m" \
            --cpus="1.0" \
            -v "${workDir}:/workspace" \
            -w /workspace \
            gcc:latest \
            timeout ${timeLimit}s ./solution < input.txt`;

        return await this.runCommand(runCmd, timeLimit);
    }

    async executeC(code, input, workDir, timeLimit, memoryLimit) {
        const codeFile = path.join(workDir, 'solution.c');
        const inputFile = path.join(workDir, 'input.txt');

        await fs.writeFile(codeFile, code);
        await fs.writeFile(inputFile, input || '');

        // Compile
        const compileCmd = `docker run --rm \
            -v "${workDir}:/workspace" \
            -w /workspace \
            gcc:latest \
            gcc -o solution solution.c`;

        const compileResult = await this.runCommand(compileCmd, 10);

        if (!compileResult.success) {
            return {
                success: false,
                output: '',
                error: `Compilation Error:\n${compileResult.error}`,
                executionTime: 0
            };
        }

        // Execute
        const runCmd = `docker run --rm \
            --network none \
            --memory="${memoryLimit}m" \
            --cpus="1.0" \
            -v "${workDir}:/workspace" \
            -w /workspace \
            gcc:latest \
            timeout ${timeLimit}s ./solution < input.txt`;

        return await this.runCommand(runCmd, timeLimit);
    }

    async executeJavaScript(code, input, workDir, timeLimit, memoryLimit) {
        const codeFile = path.join(workDir, 'solution.js');
        const inputFile = path.join(workDir, 'input.txt');

        // Wrap code to read from input file
        const wrappedCode = `
const fs = require('fs');
const input = fs.readFileSync('/workspace/input.txt', 'utf8');
${code}
`;

        await fs.writeFile(codeFile, wrappedCode);
        await fs.writeFile(inputFile, input || '');

        const dockerCmd = `docker run --rm \
            --network none \
            --memory="${memoryLimit}m" \
            --cpus="1.0" \
            -v "${workDir}:/workspace" \
            -w /workspace \
            node:18-alpine \
            timeout ${timeLimit}s node solution.js`;

        return await this.runCommand(dockerCmd, timeLimit);
    }

    async runCommand(command, timeLimit) {
        const startTime = Date.now();

        return new Promise((resolve) => {
            exec(command, {
                timeout: (timeLimit + 2) * 1000,
                maxBuffer: 1024 * 1024 // 1MB buffer
            }, (error, stdout, stderr) => {
                const executionTime = (Date.now() - startTime) / 1000;

                if (error) {
                    // Check if it's a timeout
                    if (error.killed || error.signal === 'SIGTERM') {
                        resolve({
                            success: false,
                            output: stdout,
                            error: `Time Limit Exceeded (${timeLimit}s)`,
                            executionTime: timeLimit
                        });
                    } else {
                        resolve({
                            success: false,
                            output: stdout,
                            error: stderr || error.message,
                            executionTime
                        });
                    }
                } else {
                    resolve({
                        success: true,
                        output: stdout.trim(),
                        error: stderr,
                        executionTime
                    });
                }
            });
        });
    }

    async cleanup(workDir) {
        try {
            await fs.rm(workDir, { recursive: true, force: true });
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    }

    // Test against multiple test cases
    async runTestCases(language, code, testCases, timeLimit, memoryLimit) {
        const results = [];
        let totalScore = 0;
        let maxScore = 0;

        for (const testCase of testCases) {
            maxScore += testCase.marks;

            const result = await this.executeCode({
                language,
                code,
                input: testCase.input,
                timeLimit,
                memoryLimit
            });

            const passed = result.success &&
                result.output.trim() === testCase.expectedOutput.trim();

            results.push({
                input: testCase.isHidden ? '[Hidden]' : testCase.input,
                expectedOutput: testCase.isHidden ? '[Hidden]' : testCase.expectedOutput,
                actualOutput: result.output,
                passed,
                error: result.error,
                executionTime: result.executionTime,
                marks: passed ? testCase.marks : 0,
                maxMarks: testCase.marks
            });

            if (passed) {
                totalScore += testCase.marks;
            }
        }

        return {
            results,
            totalScore,
            maxScore,
            passed: totalScore === maxScore
        };
    }
}

module.exports = new CodeExecutor();
