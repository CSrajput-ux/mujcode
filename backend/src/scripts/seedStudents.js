const fs = require('fs');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { sequelize } = require('../config/database');
const { User, StudentProfile } = require('../models/pg');
const StudentProgress = require('../models/mongo/StudentProgress');
require('dotenv').config();

const students = require('./students.json');

const seedStudents = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        await sequelize.authenticate();
        console.log('✅ Connected to Postgres');

        for (const s of students) {
            // Normalize names
            let firstName = s.name.split(' ')[0].toLowerCase();
            // Remove dots and special chars from first name for consistency
            firstName = firstName.replace(/[^a-z0-9]/g, '');

            // Email: firstname.regno@muj.manipal.edu
            const email = `${firstName}.${s.regNo}@muj.manipal.edu`;

            // Password: firstname.regno
            const password = `${firstName}.${s.regNo}`;

            // Check if user exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                console.log(`⚠️ User ${email} already exists. Skipping.`);
                continue;
            }

            // Create User
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                email: email,
                password: hashedPassword,
                name: s.name, // Keep original casing/full name for display
                role: 'student',
                isApproved: true,
                isActive: true
            });

            // Create Profile
            await StudentProfile.create({
                userId: newUser.id,
                rollNumber: s.regNo,
                section: 'A', // Default section
                batch: '2024', // Default batch based on RegNo 24...
                semester: 4,   // Default semester
                department: 'CSE', // Default department
                program: 'B.Tech',
                isVerified: true
            });

            // Initialize Progress
            await StudentProgress.create({
                userId: newUser.id,
                totalPoints: 0,
                solvedProblems: [],
                badges: []
            });

            console.log(`✅ Created student: ${s.name} (${email})`);
        }

        console.log(`🎉 Seeding Complete! Processed ${students.length} students.`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding students:', error);
        process.exit(1);
    }
};

seedStudents();
