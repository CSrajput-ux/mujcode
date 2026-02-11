// File: src/controllers/studentProfileController.js
const StudentProfile = require('../models/pg/StudentProfile');
const User = require('../models/pg/User');

// Update student profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Identification via JWT token
        const { section, branch, year, course, department } = req.body;

        // Security: Prevent updating sensitive fields like email or rollNumber
        // We only pick what is allowed from req.body

        // Find student profile
        let profile = await StudentProfile.findOne({ where: { userId } });

        if (!profile) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        // Update profile - Whitelisted fields only
        if (section !== undefined) profile.section = section;
        if (branch !== undefined) profile.branch = branch;
        if (year !== undefined) profile.year = year;
        if (course !== undefined) profile.course = course;
        if (department !== undefined) profile.department = department;

        await profile.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            profile: {
                section: profile.section,
                branch: profile.branch,
                year: profile.year,
                course: profile.course,
                department: profile.department
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
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
