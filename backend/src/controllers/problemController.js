// File: src/controllers/problemController.js
const Problem = require('../models/mongo/Problem');
const Submission = require('../models/mongo/Submission');
const cacheService = require('../services/cacheService');

// Get problem stats (count by difficulty)
exports.getProblemStats = async (req, res) => {
    try {
        const stats = await Problem.aggregate([
            {
                $group: {
                    _id: { $toLower: "$difficulty" }, // Normalize to lowercase
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = {
            total: {
                easy: 0,
                medium: 0,
                hard: 0
            }
        };

        stats.forEach(item => {
            if (item._id === 'easy') result.total.easy = item.count;
            if (item._id === 'medium') result.total.medium = item.count;
            if (item._id === 'hard') result.total.hard = item.count;
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all problems with filters and pagination
exports.getProblems = async (req, res) => {
    try {
        const { category, difficulty, topic, search, page = 1, limit = 50 } = req.query;
        const userId = req.query.userId;

        // Pagination params
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 items
        const skip = (pageNum - 1) * limitNum;

        const cacheKey = `problems:${JSON.stringify({ category, difficulty, topic, search, page: pageNum, limit: limitNum })}`;

        // 1. Try Cache
        let result = await cacheService.get(cacheKey);

        if (!result) {
            // Build filter object
            const filter = {};
            if (category && category !== 'All') filter.category = category;
            if (difficulty) filter.difficulty = difficulty;
            if (topic) filter.topic = topic;
            if (search) filter.title = { $regex: search, $options: 'i' };

            // Get total count
            const total = await Problem.countDocuments(filter);

            // Get paginated problems from DB
            const problems = await Problem.find(filter)
                .sort({ number: 1 })
                .skip(skip)
                .limit(limitNum);

            result = {
                problems,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum),
                    hasNext: pageNum < Math.ceil(total / limitNum),
                    hasPrev: pageNum > 1
                }
            };

            // Set Cache (5 minutes)
            await cacheService.set(cacheKey, result, 300);
        }

        // If userId provided, check which problems are solved
        if (userId) {
            const StudentProgress = require('../models/mongo/StudentProgress');
            const progress = await StudentProgress.findOne({ userId });

            // Create Set for O(1) lookup
            const solvedSet = new Set(progress ? progress.solvedProblemIds.map(id => id.toString()) : []);

            // Mark problems as solved, attempted, or todo
            result.problems = result.problems.map(problem => {
                const problemObj = problem.toObject ? problem.toObject() : { ...problem };

                // Check if problem number is in solved set
                if (solvedSet.has(problemObj.number.toString())) {
                    problemObj.status = 'solved';
                } else {
                    problemObj.status = 'todo';
                }

                return problemObj;
            });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single problem by ID
exports.getProblemById = async (req, res) => {
    try {
        const { id } = req.params;
        const cacheKey = `problem:id:${id}`;

        // 1. Try Cache
        let problem = await cacheService.get(cacheKey);

        if (!problem) {
            // SMART LOOKUP: Check if ID is numeric (Problem Number) or ObjectId
            if (!isNaN(id)) {
                problem = await Problem.findOne({ number: id });
            } else {
                problem = await Problem.findById(id);
            }

            if (!problem) return res.status(404).json({ error: 'Problem not found' });

            // Set Cache
            await cacheService.set(cacheKey, problem, 300);
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
        const cacheKey = `problem:number:${number}`;

        // 1. Try Cache
        let problem = await cacheService.get(cacheKey);

        if (!problem) {
            problem = await Problem.findOne({ number: parseInt(number) });
            if (!problem) return res.status(404).json({ error: 'Problem not found' });

            // Set Cache
            await cacheService.set(cacheKey, problem, 300);
        }

        res.status(200).json({ problem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get categories and topics for filters
exports.getMetadata = async (req, res) => {
    try {
        const cacheKey = 'problems:metadata';

        let metadata = await cacheService.get(cacheKey);

        if (!metadata) {
            const categories = await Problem.distinct('category');
            const topics = await Problem.distinct('topic');
            const difficulties = ['Easy', 'Medium', 'Hard'];

            metadata = { categories, topics, difficulties };
            await cacheService.set(cacheKey, metadata, 3600); // Cache for 1 hour
        }

        res.status(200).json(metadata);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
