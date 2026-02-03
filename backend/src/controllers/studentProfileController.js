// File: src/controllers/studentProfileController.js
const StudentProfile = require('../models/pg/StudentProfile');
const User = require('../models/pg/User');

// Update student profile
exports.updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { section, branch, year, course, department } = req.body;

        // Find student profile
        let profile = await StudentProfile.findOne({ where: { userId } });

        if (!profile) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        // Update profile
        profile.section = section || profile.section;
        profile.branch = branch || profile.branch;
        profile.year = year || profile.year;
        // Note: course and department aren't in the current model schema
        // They can be added later if needed

        await profile.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            profile: {
                section: profile.section,
                branch: profile.branch,
                year: profile.year
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get student profile
exports.getProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        const profile = await StudentProfile.findOne({
            where: { userId },
            include: [{ model: User, attributes: ['name', 'email', 'collegeId', 'role'] }]
        });

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.status(200).json({ profile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
