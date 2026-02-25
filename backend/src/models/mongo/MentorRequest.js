// File: src/models/mongo/MentorRequest.js
const mongoose = require('mongoose');

const mentorRequestSchema = new mongoose.Schema({
    studentId: {
        type: String, // Postgres User UUID
        required: true,
        ref: 'User'
    },
    facultyId: {
        type: mongoose.Schema.Types.ObjectId, // Mongo Faculty _id
        required: true,
        ref: 'Faculty'
    },
    studentName: { type: String, required: true },
    registrationId: { type: String, required: true },
    department: { type: String, required: true },
    section: { type: String, required: true },
    academicYear: { type: String, required: true },
    semester: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

// Prevent duplicate pending/approved requests for same student-faculty pair?
// Requirement says "Lock student mentor selection until approved".
// So one student can have only ONE pending or active mentor request at a time.
mentorRequestSchema.index({ studentId: 1, status: 1 });

module.exports = mongoose.model('MentorRequest', mentorRequestSchema);
