// File: src/modules/student/controllers/studentAnalyticsController.js
const StudentProgress = require('../../../models/mongo/StudentProgress');
const Problem = require('../../../models/mongo/Problem');
const Submission = require('../../../models/mongo/Submission');

// Get performance trend (cumulative solved problems over time)
exports.getPerformanceTrend = async (req, res) => {
    try {
        const { studentId } = req.params;

        const trendData = await Submission.aggregate([
            {
                $match: {
                    userId: String(studentId),
                    verdict: 'Accepted'
                }
            },
            {
                $project: {
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    problemId: 1
                }
            },
            {
                $group: {
                    _id: "$date",
                    uniqueProblems: { $addToSet: "$problemId" }
                }
            },
            {
                $project: {
                    date: "$_id",
                    count: { $size: "$uniqueProblems" },
                    _id: 0
                }
            },
            { $sort: { date: 1 } }
        ]);

        if (trendData.length === 0) {
            return res.status(200).json({ trend: [] });
        }

        let cumulativeSolved = 0;
        const trend = trendData.map(day => {
            cumulativeSolved += day.count;
            return {
                date: day.date,
                solved: cumulativeSolved,
                daily: day.count
            };
        });

        res.status(200).json({ trend });
    } catch (error) {
        console.error('Error in getPerformanceTrend:', error);
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

        const allProblems = await Problem.find({});
        const problemTopicMap = {};
        allProblems.forEach(p => {
            problemTopicMap[p._id.toString()] = p.topic;
        });

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

        allProblems.forEach(p => {
            if (!topicStats[p.topic]) {
                topicStats[p.topic] = { solved: 0, total: 0 };
            }
            topicStats[p.topic].total += 1;
        });

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

        const allProblems = await Problem.find({});
        const problemTopicMap = {};
        allProblems.forEach(p => {
            problemTopicMap[p._id.toString()] = p.topic;
        });

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

        const weakAreas = Object.entries(topicStats)
            .map(([topic, stats]) => ({
                topic,
                category: 'Needs Practice',
                percentage: Math.round((stats.solved / stats.total) * 100)
            }))
            .filter(area => area.percentage < 60)
            .sort((a, b) => a.percentage - b.percentage)
            .slice(0, 3);

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

        const totalSubmissions = progress.submissions?.length || 0;
        const acceptedSubmissions = progress.submissions?.filter(s => s.status === 'accepted').length || 0;
        const averageScore = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0;

        res.status(200).json({
            testsCompleted: Math.floor(totalSubmissions * 0.3),
            assignmentsSubmitted: Math.floor(totalSubmissions * 0.7),
            averageScore,
            certifications: progress.totalSolved >= 10 ? Math.floor(progress.totalSolved / 10) : 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
