// File: src/scripts/seedFacultyUser.js
const bcrypt = require('bcryptjs');
const { User, FacultyProfile } = require('../models/pg');
const { sequelize } = require('../config/database');
require('dotenv').config();

const seedFaculty = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL');

        const email = 'chhotu.singh@jaipur.manipal.edu';
        const name = 'Chhotu Singh';
        const passwordRaw = email.split('@')[0]; // chhotu.singh
        const hashedPassword = await bcrypt.hash(passwordRaw, 10);

        await sequelize.transaction(async (t) => {
            const [user, created] = await User.findOrCreate({
                where: { email },
                defaults: {
                    name,
                    password: hashedPassword,
                    role: 'faculty',
                    isApproved: true,
                    isActive: true,
                    isPasswordChanged: false
                },
                transaction: t
            });

            if (created) {
                await FacultyProfile.create({
                    userId: user.id,
                    employeeId: 'EMP' + Math.floor(1000 + Math.random() * 9000),
                    department: 'CSE',
                    designation: 'Senior Faculty'
                }, { transaction: t });
                console.log(`✅ Faculty User Created: ${email} | Pass: ${passwordRaw}`);
            } else {
                // Update password to match requested format if user already exists
                user.password = hashedPassword;
                await user.save({ transaction: t });
                console.log(`⚠️ Faculty User Already Exists. Password updated to: ${passwordRaw}`);
            }
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedFaculty();
