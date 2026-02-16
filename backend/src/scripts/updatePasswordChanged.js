// Script to set isPasswordChanged to true for test users
const { User } = require('../models/pg');
const { sequelize } = require('../config/database');
require('dotenv').config();

const updateTestUsers = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL');

        const testEmails = [
            'chhotu.2427030521@muj.manipal.edu',
            'dr.rishigupta@jaipur.manipal.edu',
            'chhotu.singh@jaipur.manipal.edu'
        ];

        for (const email of testEmails) {
            const user = await User.findOne({ where: { email } });

            if (user) {
                user.isPasswordChanged = true;  // Mark password as changed to skip modal
                user.isApproved = true;
                user.isActive = true;
                await user.save();
                console.log(`✅ Updated ${email}: isPasswordChanged=${user.isPasswordChanged}, isApproved=${user.isApproved}`);
            } else {
                console.log(`❌ User not found: ${email}`);
            }
        }

        console.log('\n✅ All test users updated - they can now login and go directly to dashboard!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

updateTestUsers();
