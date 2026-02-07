// File: src/controllers/analyticsController.js
const StudentProgress = require('../models/mongo/StudentProgress');
const Problem = require('../models/mongo/Problem');
const User = require('../models/pg/User');
const StudentProfile = require('../models/pg/StudentProfile');

const Submission = require('../models/mongo/Submission');

// Get performance trend (cumulative solved problems over time)
exports.getPerformanceTrend = async (req, res) => {
    try {
        const { studentId } = req.params;

        // aggregation breakdown:
        // 1. match accepted submissions for the user
        // 2. group by date (YYYY-MM-DD) and collect unique problem IDs
        // 3. sort by date
        // 4. calculate cumulative count in JS (or could use $setWindowFields if Mongo 5.0+)

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

        // Calculate cumulative solved count
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

// --- FACULTY ANALYTICS ---

// Get Faculty Dashboard Stats (KPIs)
exports.getFacultyDashboardStats = async (req, res) => {
    try {
        // Mock data for now, ideally tailored to the logged-in faculty
        const stats = {
            totalStudents: 150,
            activeStudentsPct: 85, // 85% active in last 7 days
            avgDailySubmissions: 2.4,
            overallSuccessRate: 78, // % passed
            growthTrend: 12 // +12% vs last month
        };
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Section Performance (Graph Data)
exports.getSectionPerformance = async (req, res) => {
    try {
        // Mock data needed for Recharts: [{ name: 'Date', 'Section A': 10, 'Section B': 15 }]
        const data = [
            { name: 'Mon', 'Section A': 40, 'Section B': 24, 'Section C': 24 },
            { name: 'Tue', 'Section A': 30, 'Section B': 13, 'Section C': 22 },
            { name: 'Wed', 'Section A': 20, 'Section B': 58, 'Section C': 22 },
            { name: 'Thu', 'Section A': 27, 'Section B': 39, 'Section C': 20 },
            { name: 'Fri', 'Section A': 18, 'Section B': 48, 'Section C': 21 },
            { name: 'Sat', 'Section A': 23, 'Section B': 38, 'Section C': 25 },
            { name: 'Sun', 'Section A': 34, 'Section B': 43, 'Section C': 21 },
        ];
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Activity Metrics (Bar Chart Data)
exports.getActivityMetrics = async (req, res) => {
    try {
        const data = [
            { name: 'Assignments', value: 120 },
            { name: 'Quizzes', value: 200 },
            { name: 'Case Studies', value: 45 },
            { name: 'Research', value: 15 },
        ];
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Success Rates (Pie Chart Data)
exports.getSuccessRates = async (req, res) => {
    try {
        const data = [
            { name: 'Passed', value: 400, color: '#22c55e' }, // green
            { name: 'Failed', value: 50, color: '#ef4444' }, // red
            { name: 'Not Attempted', value: 100, color: '#94a3b8' }, // gray
        ];
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = exports;
