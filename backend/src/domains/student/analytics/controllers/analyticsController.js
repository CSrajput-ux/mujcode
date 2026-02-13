// File: src/controllers/analyticsController.js
const StudentProgress = require('../models/mongo/StudentProgress');
const Problem = require('../models/mongo/Problem');
const User = require('../models/pg/User');
const StudentProfile = require('../models/pg/StudentProfile');

const Submission = require('../models/mongo/Submission');
const Faculty = require('../models/mongo/Faculty');
const AssignmentSubmission = require('../models/mongo/AssignmentSubmission');
const TestSubmission = require('../models/mongo/TestSubmission');

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

// Get Faculty Dashboard Stats (KPIs) with REAL data
exports.getFacultyDashboardStats = async (req, res) => {
    try {
        const faculty = await Faculty.findOne({ userId: req.user.id });
        if (!faculty) return res.status(403).json({ error: 'Faculty profile not found' });

        const sections = faculty.teachingAssignments.map(a => a.section);
        const courseIds = [...faculty.teachingCourses, ...faculty.createdCourses];

        // 1. Total Students in these sections
        // Note: We need a way to count students from Mongo or PG based on section.
        // Assuming StudentProfile (PG) is the source of truth for section assignments.
        const totalStudents = await StudentProfile.count({
            where: { section: sections }
        });

        // 2. Submissions in last 7 days (Active Students/Traffic)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const submissionsCount = await Submission.countDocuments({
            createdAt: { $gte: sevenDaysAgo },
            section: { $in: sections }
        });

        const activeStudentsCount = await Submission.distinct('userId', {
            createdAt: { $gte: sevenDaysAgo },
            section: { $in: sections }
        });

        // 3. Success Rate (Overall Passed / Total Attempted)
        const stats = await Submission.aggregate([
            { $match: { section: { $in: sections } } },
            {
                $group: {
                    _id: null,
                    totalAttempts: { $sum: 1 },
                    passedAttempts: {
                        $sum: { $cond: [{ $eq: ["$verdict", "Accepted"] }, 1, 0] }
                    }
                }
            }
        ]);

        const passRate = stats.length > 0 ? (stats[0].passedAttempts / stats[0].totalAttempts) * 100 : 0;
        const avgDaily = submissionsCount / 7;

        res.status(200).json({
            totalStudents,
            activeStudentsPct: totalStudents > 0 ? Math.round((activeStudentsCount.length / totalStudents) * 100) : 0,
            avgDailySubmissions: parseFloat(avgDaily.toFixed(1)),
            overallSuccessRate: Math.round(passRate),
            growthTrend: 0 // Default for now
        });
    } catch (error) {
        console.error('Faculty Stats Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get Section Performance (Graph Data) with REAL aggregations
exports.getSectionPerformance = async (req, res) => {
    try {
        const faculty = await Faculty.findOne({ userId: req.user.id });
        if (!faculty) return res.status(403).json({ error: 'Unauthorized' });

        const sections = faculty.teachingAssignments.map(a => a.section);

        // Fetch students in these sections from PG to filter Mongo submissions
        const profiles = await StudentProfile.findAll({
            where: { section: sections },
            attributes: ['userId', 'section']
        });

        const studentIdToSection = {};
        const studentIds = profiles.map(p => {
            studentIdToSection[p.userId] = p.section;
            return p.userId;
        });

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const performanceData = await Submission.aggregate([
            {
                $match: {
                    userId: { $in: studentIds },
                    createdAt: { $gte: sevenDaysAgo },
                    verdict: 'Accepted'
                }
            },
            {
                $project: {
                    day: { $dateToString: { format: "%a", date: "$createdAt" } }, // Mon, Tue, etc.
                    userId: 1
                }
            },
            {
                $group: {
                    _id: { day: "$day", userId: "$userId" },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Transform into Recharts format: [{ name: 'Mon', 'Section A': 10, 'Section B': 15 }]
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const result = days.map(day => {
            const entry = { name: day };
            sections.forEach(s => entry[s] = 0);

            performanceData.forEach(d => {
                if (d._id.day === day) {
                    const section = studentIdToSection[d._id.userId];
                    if (section) entry[section] += d.count;
                }
            });
            return entry;
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Section Performance Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get Activity Metrics (Bar Chart Data) with REAL distribution
exports.getActivityMetrics = async (req, res) => {
    try {
        const faculty = await Faculty.findOne({ userId: req.user.id });
        if (!faculty) return res.status(403).json({ error: 'Unauthorized' });

        const sections = faculty.teachingAssignments.map(a => a.section);

        // Get student IDs for filtering
        const profiles = await StudentProfile.findAll({
            where: { section: sections },
            attributes: ['userId']
        });
        const studentIds = profiles.map(p => p.userId);

        const [submissionsCount, testsCount, assignmentsByType] = await Promise.all([
            Submission.countDocuments({ userId: { $in: studentIds } }),
            TestSubmission.countDocuments({ studentId: { $in: studentIds } }),
            AssignmentSubmission.aggregate([
                { $match: { studentId: { $in: studentIds } } },
                {
                    $lookup: {
                        from: 'assignments', // Match the mongodb collection name
                        localField: 'assignmentId',
                        foreignField: '_id',
                        as: 'assignment'
                    }
                },
                { $unwind: "$assignment" },
                {
                    $group: {
                        _id: "$assignment.type",
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        const getCount = (type) => {
            const row = assignmentsByType.find(a => a._id === type);
            return row ? row.count : 0;
        };

        const data = [
            { name: 'Submissions', value: submissionsCount },
            { name: 'Quizzes/Tests', value: testsCount },
            { name: 'Assignments', value: getCount('Assignment') },
            { name: 'Case Studies', value: getCount('CaseStudy') },
            { name: 'Research', value: getCount('Research') },
        ];
        res.status(200).json(data);
    } catch (error) {
        console.error('Activity Metrics Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get Success Rates (Pie Chart Data) with REAL results
exports.getSuccessRates = async (req, res) => {
    try {
        const faculty = await Faculty.findOne({ userId: req.user.id });
        if (!faculty) return res.status(403).json({ error: 'Unauthorized' });

        const sections = faculty.teachingAssignments.map(a => a.section);
        const profiles = await StudentProfile.findAll({
            where: { section: sections },
            attributes: ['userId']
        });
        const studentIds = profiles.map(p => p.userId);

        // 1. Get Assignment/Test counts to estimate total possible attempts
        const totalAssignments = await require('../models/mongo/Assignment').countDocuments({
            section: { $in: sections }
        });

        const totalPotentialAttempts = studentIds.length * (totalAssignments || 1); // rough estimate

        const results = await Submission.aggregate([
            { $match: { userId: { $in: studentIds } } },
            {
                $group: {
                    _id: "$verdict",
                    count: { $sum: 1 }
                }
            }
        ]);

        const passed = results.find(r => r._id === 'Accepted')?.count || 0;
        const failed = results.filter(r => r._id !== 'Accepted' && r._id !== 'Pending').reduce((acc, curr) => acc + curr.count, 0);
        const attempted = passed + failed + (results.find(r => r._id === 'Pending')?.count || 0);

        const notAttempted = Math.max(0, totalPotentialAttempts - attempted);

        const data = [
            { name: 'Passed', value: passed, color: '#22c55e' },
            { name: 'Failed', value: failed, color: '#ef4444' },
            { name: 'Not Attempted', value: notAttempted, color: '#94a3b8' },
        ];
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get Automated Insights based on REAL data
exports.getFacultyInsights = async (req, res) => {
    try {
        const faculty = await Faculty.findOne({ userId: req.user.id });
        if (!faculty) return res.status(403).json({ error: 'Unauthorized' });

        const sections = faculty.teachingAssignments.map(a => a.section);
        const profiles = await StudentProfile.findAll({
            where: { section: sections },
            attributes: ['userId', 'section']
        });
        const studentIds = profiles.map(p => p.userId);
        const studentIdToSection = {};
        profiles.forEach(p => studentIdToSection[p.userId] = p.section);

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        // 1. Engagement by Section (Active Students)
        const recentSubmissions = await Submission.aggregate([
            { $match: { userId: { $in: studentIds }, createdAt: { $gte: sevenDaysAgo } } },
            { $group: { _id: "$userId" } }
        ]);

        const activeSections = {};
        recentSubmissions.forEach(s => {
            const section = studentIdToSection[s._id];
            if (section) activeSections[section] = (activeSections[section] || 0) + 1;
        });

        const sortedSections = Object.entries(activeSections).sort((a, b) => b[1] - a[1]);
        const topSection = sortedSections.length > 0 ? sortedSections[0][0] : 'None';

        // 2. Success Rate Trend (This week vs Last week)
        const [thisWeek, lastWeek] = await Promise.all([
            Submission.aggregate([
                { $match: { userId: { $in: studentIds }, createdAt: { $gte: sevenDaysAgo } } },
                { $group: { _id: null, total: { $sum: 1 }, passed: { $sum: { $cond: [{ $eq: ["$verdict", "Accepted"] }, 1, 0] } } } }
            ]),
            Submission.aggregate([
                { $match: { userId: { $in: studentIds }, createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } } },
                { $group: { _id: null, total: { $sum: 1 }, passed: { $sum: { $cond: [{ $eq: ["$verdict", "Accepted"] }, 1, 0] } } } }
            ])
        ]);

        const thisRate = thisWeek.length > 0 ? (thisWeek[0].passed / thisWeek[0].total) * 100 : 0;
        const lastRate = lastWeek.length > 0 ? (lastWeek[0].passed / lastWeek[0].total) * 100 : 0;
        const rateDiff = thisRate - lastRate;

        // 3. High Failure Rate Assignments/Problems
        const topFailures = await Submission.aggregate([
            { $match: { userId: { $in: studentIds }, verdict: { $ne: 'Accepted' } } },
            { $group: { _id: "$problemId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        const insights = [];
        if (topSection !== 'None') {
            insights.push(`Section ${topSection} has the highest engagement rate this week.`);
        }
        if (Math.abs(rateDiff) > 1) {
            insights.push(`Overall success rate has ${rateDiff > 0 ? 'improved' : 'dropped'} by ${Math.abs(rateDiff).toFixed(1)}% compared to last week.`);
        }
        if (topFailures.length > 0) {
            insights.push(`Problem #${topFailures[0]._id} has high failure rate; consider reviewing its difficulty.`);
        }

        res.status(200).json(insights);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
