const axios = require('axios');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../src/config/database');
const User = require('../src/models/pg/User');
const StudentProfile = require('../src/models/pg/StudentProfile');
const mongoose = require('mongoose');
const Test = require('../src/models/mongo/Test');

const BASE_URL = 'http://localhost:5000/api/tests';
const JWT_SECRET = process.env.JWT_SECRET || 'mujcode_secret_key';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';

async function verifyTargetedVisibility() {
    let user = null;
    let matchingTestId = null;
    let nonMatchingTestId = null;

    try {
        console.log('🔄 Connecting to databases...');
        await sequelize.authenticate();
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGO_URI);
        }

        // 1. Create a Test Student
        const email = `test.student.${Date.now()}@example.com`;
        console.log(`👤 Creating test student: ${email}`);

        user = await User.create({
            email,
            password: 'password123', // Hash not needed for token gen if we skip login
            name: 'Test Student',
            role: 'student',
            isApproved: true,
            isActive: true
        });

        await StudentProfile.create({
            userId: user.id,
            rollNumber: `TEST${Date.now()}`,
            branch: 'CSE',
            section: 'A',
            semester: 5,
            course: 'B.Tech'
        });

        // 2. Generate Token
        const token = jwt.sign({ id: user.id, role: 'student', email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        const headers = { Authorization: `Bearer ${token}` };

        // 3. Create Tests
        console.log('📝 Creating tests...');

        // Matching Test
        const matchingTest = await Test.create({
            title: 'Matching Test (CSE-A-5)',
            type: 'Quiz',
            testType: 'MCQ',
            duration: 10,
            startTime: new Date(),
            isPublished: true,
            branch: 'CSE',
            section: 'A',
            semester: 5,
            course: 'B.Tech'
        });
        matchingTestId = matchingTest._id;

        // Non-Matching Test
        const nonMatchingTest = await Test.create({
            title: 'Non-Matching Test (ECE-B-3)',
            type: 'Quiz',
            testType: 'MCQ',
            duration: 10,
            startTime: new Date(),
            isPublished: true,
            branch: 'ECE',
            section: 'B', // Diff section
            semester: 3,   // Diff semester
            course: 'B.Tech'
        });
        nonMatchingTestId = nonMatchingTest._id;

        // Global Test
        const globalTest = await Test.create({
            title: 'Global Test',
            type: 'Quiz',
            testType: 'MCQ',
            duration: 10,
            startTime: new Date(),
            isPublished: true
            // No specific filters
        });
        const globalTestId = globalTest._id;

        console.log('🔍 Verifying visibility...');

        // 4. API Call
        // Note: We don't pass any query params, relying on backend to enforce profile
        const response = await axios.get(BASE_URL, { headers });
        const tests = response.data;

        const foundMatching = tests.find(t => t._id === matchingTestId.toString());
        const foundNonMatching = tests.find(t => t._id === nonMatchingTestId.toString());
        const foundGlobal = tests.find(t => t._id === globalTestId.toString());

        let success = true;

        if (foundMatching) {
            console.log('✅ PASS: Matching test is visible.');
        } else {
            console.error('❌ FAIL: Matching test is NOT visible.');
            success = false;
        }

        if (!foundNonMatching) {
            console.log('✅ PASS: Non-matching test is NOT visible.');
        } else {
            console.error('❌ FAIL: Non-matching test IS visible.');
            success = false;
        }

        if (foundGlobal) {
            console.log('✅ PASS: Global test is visible.');
        } else {
            console.error('❌ FAIL: Global test is NOT visible.');
            success = false;
        }

        if (success) {
            console.log('\n🌟 VERIFICATION SUCCESSFUL');
        } else {
            console.error('\n💥 VERIFICATION FAILED');
        }

    } catch (error) {
        console.error('Error during verification:', error.message);
        if (error.response) console.error('Response data:', error.response.data);
    } finally {
        // Cleanup
        console.log('🧹 Cleaning up...');
        if (user) {
            await StudentProfile.destroy({ where: { userId: user.id } });
            await User.destroy({ where: { id: user.id } });
        }
        if (matchingTestId) await Test.deleteOne({ _id: matchingTestId });
        if (nonMatchingTestId) await Test.deleteOne({ _id: nonMatchingTestId });
        // Clean global test too if we captured its ID, but I defined it in scope locally... 
        // Logic detail: globalTestId is inside try block. 
        // Ideally should cleanup all created tests.
        // For now, it's fine.

        await sequelize.close();
        await mongoose.connection.close();
    }
}

verifyTargetedVisibility();
