<<<<<<< HEAD
const mongoose = require('mongoose');
const { sequelize } = require('../src/config/database');
const StudentProfile = require('../src/models/pg/StudentProfile');
const Submission = require('../src/models/mongo/Submission');
const Faculty = require('../src/models/mongo/Faculty');
require('dotenv').config({ path: '../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';

const seedAnalytics = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        await sequelize.authenticate();
        console.log('Connected for analytics seeding...');

        // 1. Identify students in Section A & B (Assigned to Test Faculty)
        const profiles = await StudentProfile.findAll({
            where: { section: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'] },
            attributes: ['userId', 'section']
        });

        if (profiles.length === 0) {
            console.log('No students found in Section A or B. Please run general seed first.');
            process.exit(1);
        }

        const studentIds = profiles.map(p => p.userId);

        // 2. Generate Random Submissions for the last 14 days
        const verdicts = ['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded'];
        const submissions = [];

        for (let i = 0; i < 200; i++) {
            const student = profiles[Math.floor(Math.random() * profiles.length)];
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 14)); // Random day in last 14 days

            submissions.push({
                userId: student.userId,
                problemId: String(Math.floor(Math.random() * 50) + 1),
                code: 'console.log("Seeded Analytics");',
                language: 'javascript',
                verdict: verdicts[Math.floor(Math.random() * verdicts.length)],
                section: student.section, // De-normalized for easier Mongo matching if possible, but our controller uses ID lookup
                createdAt: date
            });
        }

        await Submission.deleteMany({ userId: { $in: studentIds } });
        await Submission.insertMany(submissions);

        console.log('✅ Analytics Seeded!');
        console.log(`- 200 submissions created for students in Section A & B.`);
        console.log(`- Data covers last 14 days for trend analysis.`);

        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedAnalytics();
=======
const mongoose = require('mongoose');
const { sequelize } = require('../src/config/database');
const StudentProfile = require('../src/models/pg/StudentProfile');
const Submission = require('../src/models/mongo/Submission');
const Faculty = require('../src/models/mongo/Faculty');
require('dotenv').config({ path: '../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';

const seedAnalytics = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        await sequelize.authenticate();
        console.log('Connected for analytics seeding...');

        // 1. Identify students in Section A & B (Assigned to Test Faculty)
        const profiles = await StudentProfile.findAll({
            where: { section: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'] },
            attributes: ['userId', 'section']
        });

        if (profiles.length === 0) {
            console.log('No students found in Section A or B. Please run general seed first.');
            process.exit(1);
        }

        const studentIds = profiles.map(p => p.userId);

        // 2. Generate Random Submissions for the last 14 days
        const verdicts = ['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded'];
        const submissions = [];

        for (let i = 0; i < 200; i++) {
            const student = profiles[Math.floor(Math.random() * profiles.length)];
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 14)); // Random day in last 14 days

            submissions.push({
                userId: student.userId,
                problemId: String(Math.floor(Math.random() * 50) + 1),
                code: 'console.log("Seeded Analytics");',
                language: 'javascript',
                verdict: verdicts[Math.floor(Math.random() * verdicts.length)],
                section: student.section, // De-normalized for easier Mongo matching if possible, but our controller uses ID lookup
                createdAt: date
            });
        }

        await Submission.deleteMany({ userId: { $in: studentIds } });
        await Submission.insertMany(submissions);

        console.log('✅ Analytics Seeded!');
        console.log(`- 200 submissions created for students in Section A & B.`);
        console.log(`- Data covers last 14 days for trend analysis.`);

        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedAnalytics();
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
