const mongoose = require('mongoose');
const MentorRequest = require('../models/mongo/MentorRequest');
const Faculty = require('../models/mongo/Faculty');
const StudentProgress = require('../models/mongo/StudentProgress');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';

async function debug() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const requests = await MentorRequest.find({}).populate('facultyId', 'name');
        console.log('\n--- MENTOR REQUESTS ---');
        console.log(JSON.stringify(requests.map(r => ({
            id: r._id,
            studentId: r.studentId,
            faculty: r.facultyId ? r.facultyId.name : 'MISSING FACULTY',
            status: r.status
        })), null, 2));

        const progress = await StudentProgress.find({ mentorSelectionLocked: true });
        console.log('\n--- LOCKED STUDENT PROGRESS ---');
        console.log(JSON.stringify(progress.map(p => ({
            userId: p.userId,
            mentors: p.selectedMentors,
            locked: p.mentorSelectionLocked
        })), null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Debug Error:', error);
        process.exit(1);
    }
}

debug();
