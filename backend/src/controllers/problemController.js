// File: src/controllers/problemController.js
const Problem = require('../models/mongo/Problem');
const Submission = require('../models/mongo/Submission');

// Get all problems with filters
exports.getProblems = async (req, res) => {
    try {
        const { category, difficulty, topic, search, status } = req.query;
        const userId = req.query.userId;

        // Build filter object
        const filter = {};
        if (category && category !== 'All') filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
        if (topic) filter.topic = topic;
        if (search) filter.title = { $regex: search, $options: 'i' };

        // Get problems
        let problems = await Problem.find(filter).sort({ number: 1 });

        // If userId provided, check which problems are solved
        if (userId) {
            // Get all accepted submissions for this user
            const acceptedSubmissions = await Submission.find({
                userId: parseInt(userId),
                verdict: 'Accepted'
            }).select('problemId');

            // Extract problemIds (stored as strings like "1", "2", etc.)
            const solvedProblemIds = acceptedSubmissions.map(sub => sub.problemId);

            console.log('🔍 Debug - userId:', userId);
            console.log('🔍 Debug - Solved problemIds from DB:', solvedProblemIds);

            // Mark problems as solved, attempted, or todo
            problems = problems.map(problem => {
                const problemObj = problem.toObject();

                // Check if problem number matches any solved problemId
                // problemId is stored as string "1", problem.number is number 1
                const isSolved = solvedProblemIds.includes(problem.number.toString());

                if (isSolved) {
                    problemObj.status = 'solved';
                    console.log(`✅ Problem #${problem.number} marked as SOLVED`);
                } else {
                    problemObj.status = 'todo';
                }

                return problemObj;
            });
        }

        res.status(200).json({ problems });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single problem by ID
exports.getProblemById = async (req, res) => {
    try {
        const { id } = req.params;
        const problem = await Problem.findById(id);

        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        res.status(200).json({ problem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get problem by number
exports.getProblemByNumber = async (req, res) => {
    try {
        const { number } = req.params;
        const problem = await Problem.findOne({ number: parseInt(number) });

        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        res.status(200).json({ problem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get categories and topics for filters
exports.getMetadata = async (req, res) => {
    try {
        const categories = await Problem.distinct('category');
        const topics = await Problem.distinct('topic');
        const difficulties = ['Easy', 'Medium', 'Hard'];

        res.status(200).json({ categories, topics, difficulties });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
