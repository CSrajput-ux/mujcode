// File: src/controllers/studentProgressController.js
const StudentProgress = require('../models/mongo/StudentProgress');
const { UserBadge } = require('../models/mongo/Badge');
const User = require('../models/pg/User');
const StudentProfile = require('../models/pg/StudentProfile');

// Get student statistics (solved problems)
exports.getStudentStats = async (req, res) => {
    try {
        const { studentId } = req.params;

        let progress = await StudentProgress.findOne({ userId: studentId });

        // If no progress exists, return zeros
        if (!progress) {
            progress = {
                solvedProblems: { easy: 0, medium: 0, hard: 0 },
                totalSolved: 0
            };
        }

        res.status(200).json({
            solved: {
                easy: progress.solvedProblems.easy,
                medium: progress.solvedProblems.medium,
                hard: progress.solvedProblems.hard,
                total: progress.totalSolved
            },
            solvedProblemIds: progress.solvedProblemIds || [],
            totalPoints: progress.totalPoints || 0,
            totalQuestions: 500 // This should come from Problem count in DB
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user problem stats (Real-time aggregation)
exports.getUserProblemStats = async (req, res) => {
    try {
        const { userId } = req.params;
        const Submission = require('../models/mongo/Submission');

        // Aggregation Pipeline
        const stats = await Submission.aggregate([
            // 1. Match User's Accepted Submissions
            {
                $match: {
                    userId: String(userId), // Ensure string match
                    verdict: 'Accepted',
                    mode: 'submit'
                }
            },
            // 2. Group by problemId to get DISTINCT solved problems
            {
                $group: {
                    _id: "$problemId"
                }
            },
            // 3. Convert problemId (String) to Number for Lookup
            {
                $addFields: {
                    problemNum: { $toInt: "$_id" }
                }
            },
            // 4. Lookup Problem details to get difficulty
            {
                $lookup: {
                    from: "problems", // Collection name (usually plural lowercase)
                    localField: "problemNum",
                    foreignField: "number",
                    as: "problemInfo"
                }
            },
            // 5. Unwind to verify problem exists
            {
                $unwind: "$problemInfo"
            },
            // 6. Group by Difficulty
            {
                $group: {
                    _id: { $toLower: "$problemInfo.difficulty" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = {
            solved: {
                easy: 0,
                medium: 0,
                hard: 0
            },
            totalSolved: 0
        };

        stats.forEach(item => {
            if (item._id === 'easy') result.solved.easy = item.count;
            if (item._id === 'medium') result.solved.medium = item.count;
            if (item._id === 'hard') result.solved.hard = item.count;
        });

        result.totalSolved = result.solved.easy + result.solved.medium + result.solved.hard;

        res.status(200).json(result);
    } catch (error) {
        console.error('User Stats Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get student rankings
exports.getStudentRankings = async (req, res) => {
    try {
        const { studentId } = req.params;

        const user = await User.findByPk(studentId, {
            include: [{ model: StudentProfile }]
        });

        if (!user || user.role !== 'student') {
            return res.status(404).json({ error: 'Student not found' });
        }

        const studentProfile = user.StudentProfile;
        if (!studentProfile) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        // Get all students with their progress (sorted by points)
        const allProgress = await StudentProgress.find({}).sort({ totalPoints: -1 });
        const userIds = allProgress.map(p => p.userId);

        // Get all student profiles
        const allStudents = await User.findAll({
            where: { id: userIds, role: 'student' },
            include: [{ model: StudentProfile }]
        });

        // Calculate College Rank
        const collegeRank = allProgress.findIndex(p => p.userId === parseInt(studentId)) + 1;
        const totalCollege = allProgress.length || 1;

        // Calculate Branch Rank
        const sameBranchStudents = allStudents.filter(s =>
            s.StudentProfile && s.StudentProfile.branch === studentProfile.branch
        );
        const branchProgress = allProgress.filter(p =>
            sameBranchStudents.some(s => s.id === p.userId)
        );
        const branchRank = branchProgress.findIndex(p => p.userId === parseInt(studentId)) + 1;
        const totalBranch = branchProgress.length || 1;

        // Calculate Section Rank
        const sameSectionStudents = allStudents.filter(s =>
            s.StudentProfile &&
            s.StudentProfile.branch === studentProfile.branch &&
            s.StudentProfile.section === studentProfile.section
        );
        const sectionProgress = allProgress.filter(p =>
            sameSectionStudents.some(s => s.id === p.userId)
        );
        const sectionRank = sectionProgress.findIndex(p => p.userId === parseInt(studentId)) + 1;
        const totalSection = sectionProgress.length || 1;

        res.status(200).json({
            ranks: [
                { label: 'College Rank', value: `#${collegeRank || '-'}`, total: `/ ${totalCollege}` },
                { label: 'Branch Rank', value: `#${branchRank || '-'}`, total: `/ ${totalBranch}` },
                { label: 'Section Rank', value: `#${sectionRank || '-'}`, total: `/ ${totalSection}` }
            ]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get student badges
exports.getStudentBadges = async (req, res) => {
    try {
        const { studentId } = req.params;

        const userBadges = await UserBadge.findOne({ userId: studentId })
            .populate('badges.badgeId');

        if (!userBadges || userBadges.badges.length === 0) {
            return res.status(200).json({ badges: [], count: 0 });
        }

        const badges = userBadges.badges.map(b => ({
            name: b.badgeId.name,
            description: b.badgeId.description,
            icon: b.badgeId.icon,
            earnedAt: b.earnedAt
        }));

        res.status(200).json({ badges, count: badges.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get student activity heatmap
exports.getStudentActivity = async (req, res) => {
    try {
        const { studentId } = req.params;

        const progress = await StudentProgress.findOne({ userId: studentId });

        if (!progress || !progress.activityMap) {
            return res.status(200).json({ activity: [] });
        }

        res.status(200).json({ activity: progress.activityMap });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get student activity heatmap (New Activity Collection)
exports.getHeatmap = async (req, res) => {
    try {
        const { activityService } = require('../services/activityService');
        // Require here or at top. Using require at top is better, but local for now to avoid breaking changes if service needs lazy load.
        // Actually, let's fix imports properly.
        const service = require('../services/activityService');

        const { studentId } = req.params;
        const data = await service.getActivityHeatmap(studentId);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
