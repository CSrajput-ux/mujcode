const express = require('express');
const router = express.Router();
const Question = require('../models/mongo/Question');
const Submission = require('../models/mongo/Submission');
const { verifyToken, verifyFaculty } = require('../middlewares/authMiddleware');
const { Queue } = require('bullmq');

// Redis Connection for BullMQ
const connection = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379
};

const submissionQueue = new Queue('submissionQueue', { connection });

// @route   POST /api/faculty/questions/create
// @desc    Create a new question
// @access  Faculty
router.post('/questions/create', verifyToken, verifyFaculty, async (req, res) => {
    try {
        const { title, description, difficulty, type, tags, languages, testCases, defaultCode, topic } = req.body;

        const newQuestion = new Question({
            title,
            description,
            difficulty,
            type,
            tags,
            topic,
            languages,
            testCases,
            defaultCode,
            createdBy: req.user.id
        });

        await newQuestion.save();
        res.status(201).json({ success: true, count: 1, data: newQuestion });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   GET /api/faculty/questions
// @desc    Get all questions created by the logged-in faculty
// @access  Faculty
router.get('/questions', verifyToken, verifyFaculty, async (req, res) => {
    try {
        const questions = await Question.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: questions.length, data: questions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   GET /api/faculty/questions/:id
// @desc    Get single question details
// @access  Faculty
router.get('/questions/:id', verifyToken, verifyFaculty, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ success: false, error: 'Question not found' });
        }
        res.status(200).json({ success: true, data: question });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   POST /api/faculty/questions/run
// @desc    Dry Run Code against provided test cases
// @access  Faculty
router.post('/questions/run', verifyToken, verifyFaculty, async (req, res) => {
    try {
        const { code, language, testCases } = req.body;

        if (!code || !language) {
            return res.status(400).json({ success: false, error: 'Code and Language are required' });
        }

        // Create a temporary submission record
        // Note: For dry-run, we might want to clean these up periodically or treat them as transient.
        const submission = await Submission.create({
            userId: req.user.id,
            problemId: 'dry-run', // Placeholder
            code,
            language,
            verdict: 'Pending',
            mode: 'dry-run'
        });

        // Add to Queue
        await submissionQueue.add('submission', {
            code,
            language,
            userId: req.user.id,
            submissionId: submission._id,
            mode: 'run', // Use 'run' mode in worker which expects single input or we need to update worker to handle array
            // The worker currently supports 'run' (single input) or 'submit' (problem.testCases).
            // We need to pass custom test cases for dry run.
            // Let's assume for now we run against the FIRST test case provided in the body for the "Run" button action.
            userInput: testCases && testCases.length > 0 ? testCases[0].input : ''
        });

        res.status(200).json({ success: true, submissionId: submission._id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   GET /api/faculty/questions/submission/:id
// @desc    Get submission result (polling)
// @access  Faculty
router.get('/questions/submission/:id', verifyToken, verifyFaculty, async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({ success: false, error: 'Submission not found' });
        }
        res.status(200).json({ success: true, data: submission });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
