const Submission = require('../models/mongo/Submission');
const { addSubmissionToQueue } = require('../services/queueService');

exports.submitCode = async (req, res) => {
    try {
        const { userId, problemId, code, language, mode, userInput } = req.body;

        // DEDUPLICATION: If this code is already Accepted, return the existing submission.
        // This prevents duplicate entries for the EXACT same code.
        if (mode === 'submit') {
            const existingSubmission = await Submission.findOne({
                userId,
                problemId: String(problemId),
                code,
                verdict: 'Accepted' // Only deduplicate if it was actually correct
            });

            if (existingSubmission) {
                console.log(`♻️  Found existing accepted submission for user ${userId}, Problem ${problemId}`);

                // Log activity even for duplicate submissions (User active today)
                const activityService = require('../services/activityService');
                await activityService.logActivity(userId);

                return res.status(200).json({
                    message: "Code already submitted and accepted",
                    submissionId: existingSubmission._id,
                    status: "Accepted" // Instant success
                });
            }
        }

        // Create Submission Entry
        // IMPORTANT: We save it initially to track status via polling. 
        // Filter logic in getUserSubmissions ensures "Run" or "Failed" attempts don't clutter history.
        const submission = await Submission.create({
            userId,
            problemId: String(problemId), // Ensure string
            code,
            language,
            mode: mode || 'submit',
            verdict: 'Pending'
        });

        // Add to Queue
        await addSubmissionToQueue({
            submissionId: submission._id,
            userId,
            problemId,
            code,
            language,
            mode: mode || 'submit',
            userInput: userInput || ''
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

        // STRICT FILTERING: Only show 'submit' mode AND 'Accepted' verdict
        // This satisfies the requirement: "Save/Show submissions ONLY on Successful Submit"
        const submissions = await Submission.find({
            userId: String(userId),
            problemId: String(problemId),
            mode: 'submit',
            verdict: 'Accepted'
        })
            .sort({ createdAt: -1 })
            .limit(20)
            .select('code language verdict output createdAt executionTime memoryUsed');

        res.status(200).json({
            submissions: submissions || []
        });

    } catch (error) {
        console.error('Get user submissions error:', error);
        res.status(500).json({ error: error.message });
    }
};