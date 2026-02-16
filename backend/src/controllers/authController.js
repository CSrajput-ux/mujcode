// File: src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/pg/User');
const StudentProfile = require('../models/pg/StudentProfile');

const JWT_SECRET = process.env.JWT_SECRET || 'mujcode_secret_key';

// REGISTER: Create new user

exports.register = async (req, res) => {
    try {
        const { email, password, name, role, department } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create User
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            role,
            department,
            isApproved: false // Explicitly false for new registrations
        });

        // 4. Create Empty Profile (Optional but good for ensuring row exists)
        if (role === 'student') {
            await StudentProfile.create({
                userId: user.id,
                branch: 'Undecided',
                rollNumber: `TEMP-${Date.now()}` // Temporary roll number
            }).catch(err => console.error('Auto-profile creation failed', err));
        }

        res.status(201).json({ message: 'Registration successful. Waiting for Admin Approval.' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// LOGIN: Verify and Token
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // 1. Find User
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // 3. Check Role
        if (role && user.role !== role) {
            return res.status(403).json({ error: `Unauthorized. You are registered as ${user.role}` });
        }

        // 4. Check Approval
        if (!user.isApproved) {
            return res.status(403).json({ error: 'Account not approved yet. Contact Admin.' });
        }

        // 5. Fetch Profile (if student)
        let profileData = {};
        if (user.role === 'student') {
            const profile = await StudentProfile.findOne({ where: { userId: user.id } });
            if (profile) {
                profileData = {
                    section: profile.section,
                    branch: profile.branch,
                    year: profile.year,
                    semester: profile.semester,
                    course: profile.course,
                    department: profile.department
                };
            }
        }

        // 6.b Increment Token Version (Single Session Enforcement)
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        await user.save();

        // 6. Generate Token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                email: user.email,
                tokenVersion: user.tokenVersion // Include version in token
            },
            JWT_SECRET,
            { expiresIn: '7d' } // 7 days
        );

        // 7. Set HttpOnly Cookie
        res.cookie('token', token, {
            httpOnly: true, // Cannot be accessed by JavaScript (XSS protection)
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'lax', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });

        // 8. Return user data AND token for sessionStorage
        res.status(200).json({
            message: 'Login successful',
            token, // Send token to frontend
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email,
                isPasswordChanged: user.isPasswordChanged,
                ...profileData
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET CURRENT USER (from HttpOnly cookie)
exports.getCurrentUser = async (req, res) => {
    try {
        // req.userId is set by verifyAuth middleware
        const userId = req.userId;

        // Find user in database
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] } // Don't send password
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch profile data if student
        let profileData = {};
        if (user.role === 'student') {
            const profile = await StudentProfile.findOne({ where: { userId: user.id } });
            if (profile) {
                profileData = {
                    section: profile.section,
                    branch: profile.branch,
                    year: profile.year,
                    semester: profile.semester,
                    course: profile.course,
                    department: profile.department
                };
            }
        }

        // Return full user object
        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isPasswordChanged: user.isPasswordChanged,
                isApproved: user.isApproved,
                department: user.department,
                ...profileData
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// LOGOUT: Clear HttpOnly cookie
exports.logout = async (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        // 1. Find User
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // 2. Verify Old Password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid current password' });

        // 3. Hash New Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 4. Update User
        user.password = hashedPassword;
        user.isPasswordChanged = true;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Server error during password change' });
    }
};
