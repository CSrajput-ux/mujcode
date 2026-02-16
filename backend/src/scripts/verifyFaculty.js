const mongoose = require('mongoose');
const { sequelize } = require('../config/database');
const { User, FacultyProfile } = require('../models/pg');
const Faculty = require('../models/mongo/Faculty');
require('dotenv').config();

const verifyFaculty = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        await sequelize.authenticate();
        console.log('✅ Connected to Postgres');

        const facultyUsers = await User.findAll({ where: { role: 'faculty' } });
        console.log(`Found ${facultyUsers.length} faculty users in PG.`);

        for (const user of facultyUsers) {
            console.log(`\nUser: ${user.name} (${user.email})`);

            const profile = await FacultyProfile.findOne({ where: { userId: user.id } });
            if (profile) console.log(`   ✅ PG Profile: Found (ID: ${profile.employeeId})`);
            else console.log(`   ❌ PG Profile: MISSING`);

            const mongoProfile = await Faculty.findOne({ userId: user.id });
            if (mongoProfile) console.log(`   ✅ Mongo Profile: Found (Name: ${mongoProfile.name})`);
            else console.log(`   ❌ Mongo Profile: MISSING`);
        }

        process.exit(0);

    } catch (error) {
        console.error('❌ Error verifying:', error);
        process.exit(1);
    }
};

verifyFaculty();
