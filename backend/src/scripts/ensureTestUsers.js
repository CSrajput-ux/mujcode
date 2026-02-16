// Quick script to ensure test users are approved
const bcrypt = require('bcryptjs');
const { User } = require('../models/pg');
const { sequelize } = require('../config/database');
require('dotenv').config();

const ensureTestUsers = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL');

        const testUsers = [
            {
                email: 'chhotu.2427030521@muj.manipal.edu',
                password: 'chhotu.2427030521',
                name: 'Chhotu Singh',
                role: 'student'
            },
            {
                email: 'dr.rishigupta@jaipur.manipal.edu',
                password: 'dr.rishi.gupta',
                name: 'Dr. Rishi Gupta',
                role: 'faculty'
            }
        ];

        for (const userData of testUsers) {
            const user = await User.findOne({ where: { email: userData.email } });

            if (user) {
                // Update user to be approved
                user.isApproved = true;
                user.isActive = true;
                await user.save();
                console.log(`✅ Updated ${userData.email} - Approved: ${user.isApproved}, Active: ${user.isActive}`);
            } else {
                // Create user
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                const newUser = await User.create({
                    email: userData.email,
                    password: hashedPassword,
                    name: userData.name,
                    role: userData.role,
                    isApproved: true,
                    isActive: true,
                    isPasswordChanged: false
                });
                console.log(`✅ Created ${userData.email} - Approved: true`);
            }
        }

        console.log('\n✅ All test users are now approved and ready for login!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

ensureTestUsers();
