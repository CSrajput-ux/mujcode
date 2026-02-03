const Submission = require('../models/mongo/Submission');
const { addSubmissionToQueue } = require('../services/queueService');

exports.submitCode = async (req, res) => {
    try {
        // Frontend se 'mode' aayega ('run' ya 'submit')
        // 'userInput' tab aayega jab user khud ka input dekar Run karega
        const { userId, problemId, code, language, mode, userInput } = req.body;

        // 1. Submission Entry Create karo
        const submission = await Submission.create({
            userId,
            problemId,
            code,
            language,
            mode: mode || 'submit', // Default submit
            verdict: 'Pending'
        });

        // 2. Queue mein job add karo
        await addSubmissionToQueue({
            submissionId: submission._id,
            userId,
            problemId,
            code,
            language,
            mode: mode || 'submit',
            userInput: userInput || '' // Custom input for 'run' mode
        });

        res.status(200).json({
            message: "Code queued for execution",
            submissionId: submission._id,
            status: "Pending"
        });

    } catch (error) {
        console.error('Submit code error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get submission status
exports.getSubmissionStatus = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const submission = await Submission.findById(submissionId);

        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        res.status(200).json({
            verdict: submission.verdict,
            output: submission.output,
            language: submission.language,
            mode: submission.mode,
            submittedAt: submission.createdAt
        });

    } catch (error) {
        console.error('Get status error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get user submissions for a specific problem
exports.getUserSubmissions = async (req, res) => {
    try {
        const { userId, problemId } = req.params;

        const submissions = await Submission.find({
            userId: parseInt(userId),
            problemId: problemId,
            mode: 'submit' // Only show actual submissions, not test runs
        })
            .sort({ createdAt: -1 }) // Latest first
            .limit(20) // Limit to last 20 submissions
            .select('code language verdict output createdAt');

        res.status(200).json({
            submissions: submissions || []
        });

    } catch (error) {
        console.error('Get user submissions error:', error);
        res.status(500).json({ error: error.message });
    }
};