const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const Permission = require('../models/mongo/Permission');
const StudentProfile = require('../models/pg/StudentProfile');

// @desc    Get current student's active restrictions
// @route   GET /api/student/restrictions
router.get('/restrictions', protect, authorize('student'), async (req, res) => {
    try {
        const studentId = req.user.college_id || req.user.id;

        // We need to know the student's section to check Section-level blocks
        // Ideally we get this from the Student profile
        const student = await StudentProfile.findOne({ where: { userId: studentId } });

        // 1. Direct Blocks
        const directBlocks = await Permission.find({
            scope: 'student',
            targetId: studentId,
            status: 'active'
        });

        // 2. Section Blocks
        let sectionBlocks = [];
        if (student && student.section) {
            sectionBlocks = await Permission.find({
                scope: 'section',
                section: student.section,
                status: 'active'
            });
        }

        // Combine features
        const allBlocks = [...directBlocks, ...sectionBlocks];
        const blockedFeatures = [...new Set(allBlocks.flatMap(p => p.blockedFeatures))];

        res.json({
            blockedFeatures,
            details: allBlocks // Optional: return details if we want to show "Why" in UI
        });

    } catch (error) {
        console.error('Error fetching student restrictions:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
