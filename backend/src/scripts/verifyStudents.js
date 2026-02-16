const { sequelize } = require('../config/database');
const { User, StudentProfile } = require('../models/pg');
require('dotenv').config();

const verify = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to Postgres');

        const students = await User.findAll({
            where: { role: 'student' },
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{ model: StudentProfile }]
        });

        console.log(`\nFound ${students.length} recent students:`);
        students.forEach(s => {
            console.log(`- Name: ${s.name}`);
            console.log(`  Email: ${s.email}`);
            console.log(`  RegNo: ${s.StudentProfile?.rollNumber}`);
            console.log('---');
        });

        process.exit(0);

    } catch (error) {
        console.error('❌ Error verifying:', error);
        process.exit(1);
    }
};

verify();
