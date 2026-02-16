// Quick script to check if user exists and is approved
const { User } = require('../models/pg');
const { sequelize } = require('../config/database');
require('dotenv').config();

const checkUser = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL');

        const emails = [
            'chhotu.2427030521@muj.manipal.edu',
            'dr.rishigupta@jaipur.manipal.edu',
            'chhotu.singh@jaipur.manipal.edu'
        ];

        for (const email of emails) {
            const user = await User.findOne({
                where: { email },
                attributes: ['id', 'email', 'name', 'role', 'isApproved', 'isActive', 'isPasswordChanged']
            });

            if (user) {
                console.log(`\n✅ Found: ${email}`);
                console.log(`   Name: ${user.name}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Approved: ${user.isApproved}`);
                console.log(`   Active: ${user.isActive}`);
                console.log(`   Password Changed: ${user.isPasswordChanged}`);
            } else {
                console.log(`\n❌ NOT FOUND: ${email}`);
            }
        }

        // Count total users
        const totalUsers = await User.count();
        console.log(`\n📊 Total users in database: ${totalUsers}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkUser();
