// File: src/controllers/analyticsController.js
const StudentProgress = require('../models/mongo/StudentProgress');
const Problem = require('../models/mongo/Problem');
const User = require('../models/pg/User');
const StudentProfile = require('../models/pg/StudentProfile');

// Get performance trend (cumulative points over time)
exports.getPerformanceTrend = async (req, res) => {
    try {
        const { studentId } = req.params;
        const progress = await StudentProgress.findOne({ userId: studentId });

        if (!progress || !progress.activityMap || progress.activityMap.length === 0) {
            return res.status(200).json({ trend: [] });
        }

        // Sort activity by date
        const sortedActivity = progress.activityMap.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Calculate cumulative points
        let cumulativePoints = 0;
        const trend = sortedActivity.map(activity => {
            cumulativePoints += activity.count * 5; // Approximate points per problem
            return {
                date: activity.date,
                points: cumulativePoints
            };
        });

        res.status(200).json({ trend });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get topic-wise performance
exports.getTopicPerformance = async (req, res) => {
    try {
        const { studentId } = req.params;
        const progress = await StudentProgress.findOne({ userId: studentId });

        if (!progress || !progress.submissions || progress.submissions.length === 0) {
            return res.status(200).json({ topics: [] });
        }

        // Get all problems to map topics
        const allProblems = await Problem.find({});
        const problemTopicMap = {};
        allProblems.forEach(p => {
            problemTopicMap[p._id.toString()] = p.topic;
        });

        // Count solved problems by topic
        const topicStats = {};
        progress.submissions.forEach(sub => {
            const topic = problemTopicMap[sub.problemId?.toString()];
            if (!topic) return;

            if (!topicStats[topic]) {
                topicStats[topic] = { solved: 0, total: 0 };
            }
            if (sub.status === 'accepted') {
                topicStats[topic].solved += 1;
            }
        });

        // Count total problems per topic
        allProblems.forEach(p => {
            if (!topicStats[p.topic]) {
                topicStats[p.topic] = { solved: 0, total: 0 };
            }
            topicStats[p.topic].total += 1;
        });

        // Calculate percentages
        const topics = Object.entries(topicStats).map(([topic, stats]) => ({
            topic,
            percentage: stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0,
            solved: stats.solved,
            total: stats.total
        }));

        res.status(200).json({ topics });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get areas for improvement (topics with low performance)
exports.getImprovementAreas = async (req, res) => {
    try {
        const { studentId } = req.params;
        const progress = await StudentProgress.findOne({ userId: studentId });

        if (!progress || !progress.submissions || progress.submissions.length === 0) {
            return res.status(200).json({ areas: [] });
        }

        // Get all problems
        const allProblems = await Problem.find({});
        const problemTopicMap = {};
        allProblems.forEach(p => {
            problemTopicMap[p._id.toString()] = p.topic;
        });

        // Calculate topic accuracy
        const topicStats = {};
        progress.submissions.forEach(sub => {
            const topic = problemTopicMap[sub.problemId?.toString()];
            if (!topic) return;

            if (!topicStats[topic]) {
                topicStats[topic] = { solved: 0, total: 0 };
            }
            if (sub.status === 'accepted') {
                topicStats[topic].solved += 1;
            }
            topicStats[topic].total += 1;
        });

        // Find weak areas (< 60% accuracy)
        const weakAreas = Object.entries(topicStats)
            .map(([topic, stats]) => ({
                topic,
                category: 'Needs Practice',
                percentage: Math.round((stats.solved / stats.total) * 100)
            }))
            .filter(area => area.percentage < 60)
            .sort((a, b) => a.percentage - b.percentage)
            .slice(0, 3); // Top 3 weak areas

        res.status(200).json({ areas: weakAreas });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get tests and assignments summary
exports.getTestsSummary = async (req, res) => {
    try {
        const { studentId } = req.params;
        const progress = await StudentProgress.findOne({ userId: studentId });

        if (!progress) {
            return res.status(200).json({
                testsCompleted: 0,
                assignmentsSubmitted: 0,
                averageScore: 0,
                certifications: 0
            });
        }

        // For now, use submissions as proxy for tests/assignments
        const totalSubmissions = progress.submissions?.length || 0;
        const acceptedSubmissions = progress.submissions?.filter(s => s.status === 'accepted').length || 0;
        const averageScore = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;

        res.status(200).json({
            testsCompleted: Math.floor(totalSubmissions * 0.3), // Approximate
            assignmentsSubmitted: Math.floor(totalSubmissions * 0.7),
            averageScore,
            certifications: progress.totalSolved >= 10 ? Math.floor(progress.totalSolved / 10) : 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
