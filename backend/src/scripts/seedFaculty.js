const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { sequelize } = require('../config/database');
const { User, FacultyProfile } = require('../models/pg');
const Faculty = require('../models/mongo/Faculty');
require('dotenv').config();

const usersToSeed = [
    { email: 'lav.upadhyay@jaipur.manipal.edu', name: 'Lav Upadhyay', password: 'lav.upadhyay', department: 'CSE' },
    { email: 'aditiya.sinha@jaipur.manipal.edu', name: 'Aditiya Sinha', password: 'aditiya.sinha', department: 'CSE' },
    { email: 'sanjeev.jakhar@jaipur.manipal.edu', name: 'Sanjeev Jakhar', password: 'sanjeev.jakhar', department: 'CSE' },
    { email: 'rishi.gupta@jaipur.manipal.edu', name: 'Rishi Gupta', password: 'rishi.gupta', department: 'CSE' },
    { email: 'girish.sharma@jaipur.manipal.edu', name: 'Girish Sharma', password: 'girish.sharma', department: 'CSE' }
];

const seedFaculty = async () => {
    try {
        // Connect to Mongo
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Connect to PG
        await sequelize.authenticate();
        console.log('✅ Connected to Postgres/SQLite');

        for (const user of usersToSeed) {
            // Check if user exists
            const existingUser = await User.findOne({ where: { email: user.email } });
            if (existingUser) {
                console.log(`⚠️ User ${user.email} already exists. Skipping.`);
                continue;
            }

            // Create User in PG
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const newUser = await User.create({
                email: user.email,
                password: hashedPassword,
                name: user.name,
                role: 'faculty',
                isApproved: true,
                isActive: true
            });

            // Create Faculty Profile in PG
            // Generate a random numeric employee ID for now
            const empId = 'EMP' + Math.floor(1000 + Math.random() * 9000);

            await FacultyProfile.create({
                userId: newUser.id,
                employeeId: empId,
                department: user.department,
                designation: 'Assistant Professor' // Default
            });

            // Create Faculty in Mongo
            await Faculty.create({
                userId: newUser.id,
                name: user.name,
                email: user.email,
                facultyId: empId,
                department: user.department,
                designation: 'Assistant Professor',
                teachingAssignments: [] // Start empty
            });

            console.log(`✅ Created faculty: ${user.name}`);
        }

        console.log('🎉 Seeding Complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding faculty:', error);
        process.exit(1);
    }
};

seedFaculty();
