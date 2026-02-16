const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        enum: ['Quiz', 'Assessment', 'Lab', 'Company'],
        default: 'Quiz'
    },
    testType: {
        type: String,
        enum: ['MCQ', 'Coding', 'Theory'],
        required: true,
        default: 'MCQ'
    },
    status: {
        type: String,
        enum: ['Draft', 'Upcoming', 'Live', 'Completed'],
        default: 'Draft'
    },
    builderStatus: {
        type: String,
        enum: ['draft', 'building', 'ready'],
        default: 'building'
    },
    startTime: { type: Date },
    endTime: { type: Date },
    duration: { type: Number, required: true }, // Duration in minutes

    // Target audience (who should see this test)
    branch: { type: String },   // e.g. CSE
    section: { type: String },  // e.g. A, B
    semester: { type: Number }, // e.g. 1-8
    course: { type: String },   // e.g. B.Tech, BCA

    // Question references by type
    mcqQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MCQQuestion' }],
    codingQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CodingQuestion' }],
    theoryQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TheoryQuestion' }],

    // Legacy question reference (for backward compatibility)
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],

    proctored: { type: Boolean, default: false },
    accessCode: { type: String }, // Optional code to start the test
    totalMarks: { type: Number, default: 0 },
    passingMarks: { type: Number },
    isPublished: { type: Boolean, default: false }, // Controls visibility to students
    createdBy: { type: String }, // Track which faculty created it (future use)
    createdAt: { type: Date, default: Date.now }
});

// Middleware to calculate total marks before saving
TestSchema.pre('save', async function (next) {
    // Logic to calculate total marks would go here if we populated questions
    // For now, we trust the manual input or handle it in the controller
    next();
});

module.exports = mongoose.model('Test', TestSchema);
