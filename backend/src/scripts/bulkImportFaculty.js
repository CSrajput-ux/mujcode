/**
 * Bulk Import Faculty members from MUJ Stella extracted data
 * Imports users into PostgreSQL and MongoDB, setting a default password
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { sequelize } = require('../config/database');
const { User, FacultyProfile } = require('../models/pg');
const Faculty = require('../models/mongo/Faculty');
require('dotenv').config();

const DEFAULT_PASSWORD = 'Faculty@123';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';

async function main() {
    try {
        console.log('📡 Connecting to PostgreSQL...');
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL');

        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Load data
        const dataPath = path.join(__dirname, '../data/muj_faculty_data.json');
        const facultyData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        console.log(`📄 Loaded ${facultyData.length} faculty members from JSON`);

        // Hash default password once
        console.log('🔐 Hashing default password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        console.log('🚀 Starting bulk import...');

        for (let i = 0; i < facultyData.length; i++) {
            const f = facultyData[i];

            if (!f.email) {
                skipCount++;
                continue;
            }

            try {
                const normalizedEmail = f.email.toLowerCase().trim();

                // 1. PostgreSQL User
                const [user, created] = await User.findOrCreate({
                    where: { email: normalizedEmail },
                    defaults: {
                        name: f.name,
                        password: hashedPassword,
                        role: 'faculty',
                        isApproved: true,
                        isPasswordChanged: false
                    }
                });

                if (!created && user.name !== f.name) {
                    user.name = f.name;
                    await user.save();
                }

                // 2. PostgreSQL FacultyProfile
                const emailParts = normalizedEmail.split('@')[0];
                const empId = emailParts.replace(/\./g, '_');

                await FacultyProfile.findOrCreate({
                    where: { userId: user.id },
                    defaults: {
                        employeeId: empId,
                        department: f.department,
                        designation: f.designation
                    }
                });

                // 3. MongoDB Faculty Sync
                await Faculty.findOneAndUpdate(
                    { email: normalizedEmail },
                    {
                        userId: user.id,
                        name: f.name,
                        email: normalizedEmail,
                        facultyId: empId,
                        department: f.department,
                        designation: f.designation,
                        teachingAssignments: []
                    },
                    { upsert: true, new: true, runValidators: true }
                );

                successCount++;
                if (successCount % 50 === 0) {
                    console.log(`✅ Processed ${successCount}/${facultyData.length}...`);
                }
            } catch (err) {
                console.error(`❌ Error importing ${f.email}:`, err.message);
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
