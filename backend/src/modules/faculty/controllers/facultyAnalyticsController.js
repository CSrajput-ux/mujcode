// File: src/modules/faculty/controllers/facultyAnalyticsController.js
const Faculty = require('../../../models/mongo/Faculty');
const StudentProfile = require('../../../models/pg/StudentProfile');
const Submission = require('../../../models/mongo/Submission');
const AssignmentSubmission = require('../../../models/mongo/AssignmentSubmission');
const TestSubmission = require('../../../models/mongo/TestSubmission');

// --- FACULTY ANALYTICS ---

// Get Faculty Dashboard Stats (KPIs) with REAL data
exports.getFacultyDashboardStats = async (req, res) => {
    try {
        const faculty = await Faculty.findOne({ userId: req.user.id });
        if (!faculty) return res.status(403).json({ error: 'Faculty profile not found' });

        const sections = faculty.teachingAssignments.map(a => a.section);

        // 1. Total Students in these sections
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

        // 3. Success Rate
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
            growthTrend: 0
        });
    } catch (error) {
        console.error('Faculty Stats Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get Section Performance (Graph Data)
exports.getSectionPerformance = async (req, res) => {
    try {
        const faculty = await Faculty.findOne({ userId: req.user.id });
        if (!faculty) return res.status(403).json({ error: 'Unauthorized' });

        const sections = faculty.teachingAssignments.map(a => a.section);

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
                    day: { $dateToString: { format: "%a", date: "$createdAt" } },
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

// Get Activity Metrics
exports.getActivityMetrics = async (req, res) => {
    try {
        const faculty = await Faculty.findOne({ userId: req.user.id });
        if (!faculty) return res.status(403).json({ error: 'Unauthorized' });

        const sections = faculty.teachingAssignments.map(a => a.section);

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
                        from: 'assignments',
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

// Get Success Rates
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

        const totalAssignments = await require('../../../models/mongo/Assignment').countDocuments({
            section: { $in: sections }
        });

        const totalPotentialAttempts = studentIds.length * (totalAssignments || 1);

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

// Get Automated Insights
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
