const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { sequelize } = require('../config/database');
const StudentProgress = require('../models/mongo/StudentProgress');
const { StudentProfile, User } = require('../models/pg');

const debugUser = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        await sequelize.authenticate();
        console.log('✅ Connected to Postgres/SQLite');

        // 1. Find User by Name "Chhotu" or similar
        // The ID 2427030521 in screenshot might be roll number.
        // Let's search by roll number in StudentProfile first.

        let studentProfile = await StudentProfile.findOne({ where: { rollNumber: '2427030521' } });

        if (!studentProfile) {
            console.log("❌ StudentProfile not found by rollNumber 2427030521. Searching by name 'Chhotu'...");
            const user = await User.findOne({ where: { name: 'Chhotu' } });
            if (user) {
                studentProfile = await StudentProfile.findOne({ where: { userId: user.id } });
            }
        }

        if (!studentProfile) {
            console.log('❌ Student Profile Not Found');
            process.exit(1);
        }

        console.log('✅ Found StudentProfile:', JSON.stringify(studentProfile.toJSON(), null, 2));
        const userId = studentProfile.userId;

        // 2. Check StudentProgress
        const progress = await StudentProgress.findOne({ userId: String(userId) });
        if (!progress) {
            console.log('❌ StudentProgress Not Found in MongoDB');
        } else {
            console.log('✅ Found StudentProgress:', JSON.stringify(progress.toJSON(), null, 2));
            console.log(`   -> Total Points: ${progress.totalPoints}`);
            console.log(`   -> Total Solved: ${progress.totalSolved}`);
        }

        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

debugUser();
