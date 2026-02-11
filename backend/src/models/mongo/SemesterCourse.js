const mongoose = require('mongoose');

const semesterCourseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
        // e.g., "CS101", "MA101", "PH101"
    },
    courseName: {
        type: String,
        required: true,
        trim: true
        // e.g., "Programming for Problem Solving", "Calculus"
    },
    credits: {
        type: Number,
        required: true,
        min: 0,
        max: 10
        // Usually 3-4 credits for theory, 1-2 for labs
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8
        // Semester number (1-8)
    },
    branches: [{
        type: String,
        uppercase: true,
        trim: true
        // Array of branch codes this course is for, e.g., ["CSE", "ECE", "ME"]
        // Empty array or ["ALL"] means common for all branches
    }],
    courseType: {
        type: String,
        enum: ['Theory', 'Lab', 'Project', 'Seminar', 'Internship'],
        default: 'Theory'
    },
    isElective: {
        type: Boolean,
        default: false
        // True for departmental/open electives
    },
    electiveCategory: {
        type: String,
        enum: ['', 'Departmental Elective', 'Open Elective', 'MOOC'],
        default: ''
    },
    prerequisites: [{
        type: String,
        uppercase: true
        // Course codes that must be completed before this, e.g., ["MA101"]
    }],
    syllabusOverview: {
        type: String,
        default: ''
        // Brief description of topics covered
    },
    learningOutcomes: [{
        type: String
        // Expected learning outcomes
    }],
    contactHours: {
        lecture: { type: Number, default: 0 },
        tutorial: { type: Number, default: 0 },
        practical: { type: Number, default: 0 }
    },
    evaluationScheme: {
        midTerm: { type: Number, default: 0 },
        endTerm: { type: Number, default: 0 },
        continuous: { type: Number, default: 0 },
        practical: { type: Number, default: 0 }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    academicYear: {
        type: String,
        default: ''
        // e.g., "2024-25" - for tracking curriculum changes
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for efficient queries
semesterCourseSchema.index({ semester: 1, branches: 1 });
semesterCourseSchema.index({ courseCode: 1 });

// Update timestamp on save
semesterCourseSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('SemesterCourse', semesterCourseSchema);
