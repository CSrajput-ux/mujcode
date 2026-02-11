const express = require('express');
const router = express.Router();
const codeExecutor = require('../services/codeExecutor');
const CodingQuestion = require('../models/mongo/CodingQuestion');

// POST /api/compile/run - Execute code against test cases
router.post('/run', async (req, res) => {
    try {
        const { language, code, input, timeLimit = 5, memoryLimit = 256 } = req.body;

        if (!language || !code) {
            return res.status(400).json({
                message: 'Language and code are required'
            });
        }

        const result = await codeExecutor.executeCode({
            language,
            code,
            input: input || '',
            timeLimit,
            memoryLimit
        });

        res.json(result);
    } catch (error) {
        console.error('Code execution error:', error);
        res.status(500).json({
            message: 'Code execution failed',
            error: error.message
        });
    }
});

// POST /api/compile/submit/:questionId - Submit code for a question
router.post('/submit/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;
        const { language, code } = req.body;

        if (!language || !code) {
            return res.status(400).json({
                message: 'Language and code are required'
            });
        }

        // Fetch the question
        const question = await CodingQuestion.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check if language is allowed
        if (!question.allowedLanguages.includes(language)) {
            return res.status(400).json({
                message: `Language ${language} is not allowed for this question`
            });
        }

        // Run against all test cases
        const testResults = await codeExecutor.runTestCases(
            language,
            code,
            question.testCases,
            question.timeLimit,
            question.memoryLimit
        );

        res.json({
            questionId,
            language,
            totalScore: testResults.totalScore,
            maxScore: testResults.maxScore,
            passed: testResults.passed,
            results: testResults.results
        });
    } catch (error) {
        console.error('Code submission error:', error);
        res.status(500).json({
            message: 'Code submission failed',
            error: error.message
        });
    }
});

// POST /api/compile/test - Test code against sample test cases (for faculty)
router.post('/test', async (req, res) => {
    try {
        const { language, code, testCases, timeLimit = 5, memoryLimit = 256 } = req.body;

        if (!language || !code || !testCases || !Array.isArray(testCases)) {
            return res.status(400).json({
                message: 'Language, code, and testCases are required'
            });
        }

        const testResults = await codeExecutor.runTestCases(
            language,
            code,
            testCases,
            timeLimit,
            memoryLimit
        );

        res.json(testResults);
    } catch (error) {
        console.error('Code testing error:', error);
        res.status(500).json({
            message: 'Code testing failed',
            error: error.message
        });
    }
});

module.exports = router;
