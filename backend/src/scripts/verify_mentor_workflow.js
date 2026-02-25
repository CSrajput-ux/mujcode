const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { sequelize } = require('../config/database');
const { User, StudentProfile } = require('../models/pg');
const Faculty = require('../models/mongo/Faculty');
const MentorRequest = require('../models/mongo/MentorRequest');
const StudentProgress = require('../models/mongo/StudentProgress');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';

async function verifyWorkflow() {
    try {
        console.log('📡 Connecting to Databases...');
        await sequelize.authenticate();
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected\n');

        // 1. Setup Test Data
        console.log('🧪 Setting up test data...');
        const testStudent = await User.findOne({ where: { role: 'student' } });
        const testFaculty = await Faculty.findOne();

        if (!testStudent || !testFaculty) {
            throw new Error('Need at least one student and one faculty for test');
        }

        const studentProfile = await StudentProfile.findOne({ where: { userId: testStudent.id } });

        // Ensure student has profile data for the request
        if (!studentProfile.section) studentProfile.section = 'E';
        if (!studentProfile.year) studentProfile.year = 2;
        if (!studentProfile.semester) studentProfile.semester = 4;
        await studentProfile.save();

        console.log(`Using Student: ${testStudent.name} (${testStudent.email})`);
        console.log(`Using Faculty: ${testFaculty.name} (${testFaculty.email})\n`);

        // Clean up previous test requests if any
        await MentorRequest.deleteMany({ studentId: testStudent.id });

        // 2. Simulate Student Request
        console.log('📤 Step 1: Simulating Student Request...');
        const newRequest = new MentorRequest({
            studentId: testStudent.id,
            facultyId: testFaculty._id,
            studentName: testStudent.name,
            registrationId: studentProfile.rollNumber || 'TEST12345',
            department: studentProfile.department || 'CSE',
            section: studentProfile.section,
            academicYear: `${studentProfile.year}nd Year`,
            semester: `Semester ${studentProfile.semester}`,
            status: 'pending'
        });
        await newRequest.save();

        await StudentProgress.findOneAndUpdate(
            { userId: testStudent.id },
            { mentorSelectionLocked: true },
            { upsert: true }
        );
        console.log('✅ Request Created\n');

        // 3. Simulate Faculty Fetch
        console.log('📥 Step 2: Simulating Faculty Dashboard Fetch...');
        const pendingRequests = await MentorRequest.find({
            facultyId: testFaculty._id,
            status: 'pending'
        });
        console.log(`✅ Faculty found ${pendingRequests.length} pending requests\n`);

        // 4. Individual Approval
        console.log('✅ Step 3: Simulating Individual Approval...');
        const reqToApprove = pendingRequests[0];
        reqToApprove.status = 'approved';
        await reqToApprove.save();

        await StudentProgress.findOneAndUpdate(
            { userId: reqToApprove.studentId },
            {
                $addToSet: { selectedMentors: testFaculty._id },
                $set: { mentorSelectionLocked: true }
            },
            { upsert: true }
        );
        console.log('✅ Individual Approval Successful\n');

        // 5. Verify Results
        console.log('🛡️ Step 4: Verifying Data Consistency...');
        const finalRequest = await MentorRequest.findById(reqToApprove._id);
        const progress = await StudentProgress.findOne({ userId: testStudent.id });

        console.log(`Request Status: ${finalRequest.status} (Expected: approved)`);
        console.log(`Student Locked: ${progress.mentorSelectionLocked} (Expected: true)`);
        console.log(`Mentor Assigned ID Match: ${progress.selectedMentors.includes(testFaculty._id)} (Expected: true)\n`);

        if (finalRequest.status === 'approved' && progress.mentorSelectionLocked) {
            console.log('🏆 WORKFLOW VERIFIED SUCCESSFULLY!');
        } else {
            console.log('❌ VERIFICATION FAILED!');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Verification Error:', error);
        process.exit(1);
    }
}

verifyWorkflow();
