/**
 * Bulk Import Students from extracted data
 * Imports users into PostgreSQL and MongoDB, setting a default password
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { sequelize } = require('../config/database');
const { User, StudentProfile } = require('../models/pg');
require('dotenv').config();

const DEFAULT_PASSWORD = 'Student@123';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';

// Load students data from JSON
const dataPath = path.join(__dirname, '..', 'data', 'extracted_students.json');
const studentsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

async function main() {
    try {
        console.log('📡 Connecting to PostgreSQL...');
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL');

        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        console.log(`📄 Processing ${studentsData.length} students...`);

        // Hash default password once
        console.log('🔐 Hashing default password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (let i = 0; i < studentsData.length; i++) {
            const s = studentsData[i];

            if (!s.email) {
                skipCount++;
                continue;
            }

            try {
                const normalizedEmail = s.email.toLowerCase().trim();

                // 1. PostgreSQL User
                const [user, created] = await User.findOrCreate({
                    where: { email: normalizedEmail },
                    defaults: {
                        name: s.name,
                        password: hashedPassword,
                        role: 'student',
                        isApproved: true,
                        isPasswordChanged: false
                    }
                });

                if (!created && user.name !== s.name) {
                    user.name = s.name;
                    await user.save();
                }

                // 2. PostgreSQL StudentProfile
                await StudentProfile.findOrCreate({
                    where: { userId: user.id },
                    defaults: {
                        rollNumber: s.reg,
                        branch: 'CSE',
                        department: 'Computer Science and Engineering',
                        course: 'B.Tech',
                        school: 'Faculty of Engineering',
                        section: s.sec,
                        year: 1, // Defaulting to 1st year
                        semester: 1
                    }
                });

                // Update if exists but different
                const profile = await StudentProfile.findOne({ where: { userId: user.id } });
                if (profile && (profile.section !== s.sec || !profile.school)) {
                    profile.section = s.sec;
                    profile.school = 'Faculty of Engineering';
                    profile.department = 'Computer Science and Engineering';
                    profile.course = 'B.Tech';
                    profile.branch = 'CSE';
                    await profile.save();
                }

                successCount++;
                if (successCount % 20 === 0) {
                    console.log(`✅ Processed ${successCount}/${studentsData.length}...`);
                }
            } catch (err) {
                console.error(`❌ Error importing ${s.email}:`, err.message);
                errorCount++;
            }
        }

        console.log('\n✨ Import Complete!');
        console.log(`✅ Successfully imported/updated: ${successCount}`);
        console.log(`⚠️ Skipped: ${skipCount}`);
        console.log(`❌ Errors: ${errorCount}`);

        await mongoose.connection.close();
        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

main();
