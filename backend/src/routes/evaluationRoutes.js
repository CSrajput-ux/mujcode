const express = require('express');
const router = express.Router();
const theoryEvaluator = require('../services/theoryEvaluator');
const TheoryQuestion = require('../models/mongo/TheoryQuestion');

// POST /api/evaluate/theory - Evaluate a single theory answer
router.post('/theory', async (req, res) => {
    try {
        const { questionId, studentAnswer } = req.body;

        if (!questionId || !studentAnswer) {
            return res.status(400).json({
                message: 'Question ID and student answer are required'
            });
        }

        // Fetch question
        const question = await TheoryQuestion.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Evaluate
        const evaluation = theoryEvaluator.evaluateAnswer(
            studentAnswer,
            question.modelAnswer,
            question.keywords,
            question.maxMarks
        );

        res.json({
            questionId,
            ...evaluation
        });
    } catch (error) {
        console.error('Theory evaluation error:', error);
        res.status(500).json({
            message: 'Evaluation failed',
            error: error.message
        });
    }
});

// POST /api/evaluate/theory/test - Evaluate all answers for a test
router.post('/theory/test', async (req, res) => {
    try {
        const { answers, questionIds } = req.body;

        if (!answers || !questionIds || !Array.isArray(questionIds)) {
            return res.status(400).json({
                message: 'Answers and question IDs are required'
            });
        }

        const results = await theoryEvaluator.evaluateTest(answers, questionIds);

        res.json(results);
    } catch (error) {
        console.error('Test evaluation error:', error);
        res.status(500).json({
            message: 'Test evaluation failed',
            error: error.message
        });
    }
});

module.exports = router;
