// Script to reset isPasswordChanged to false for test users to test the flow
const { User } = require('../models/pg');
const { sequelize } = require('../config/database');
require('dotenv').config();

const resetTestUsers = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL');

        const email = 'chhotu.2427030521@muj.manipal.edu';
        const user = await User.findOne({ where: { email } });

        if (user) {
            user.isPasswordChanged = false; // Reset to false to trigger modal
            user.isApproved = true;        // Ensure still approved
            user.isActive = true;          // Ensure still active
            await user.save();
            console.log(`✅ Reset ${email}: isPasswordChanged=${user.isPasswordChanged}`);
        } else {
            console.log(`❌ User not found: ${email}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

resetTestUsers();
