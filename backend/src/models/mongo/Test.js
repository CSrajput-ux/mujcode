const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        enum: ['Quiz', 'Assessment', 'Lab', 'Company'],
        default: 'Quiz'
    },
    status: {
        type: String,
        enum: ['Draft', 'Upcoming', 'Live', 'Completed'],
        default: 'Draft'
    },
    startTime: { type: Date },
    endTime: { type: Date },
    duration: { type: Number, required: true }, // Duration in minutes
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    proctored: { type: Boolean, default: false },
    accessCode: { type: String }, // Optional code to start the test
    totalMarks: { type: Number, default: 0 },
    passingMarks: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

// Middleware to calculate total marks before saving
TestSchema.pre('save', async function (next) {
    // Logic to calculate total marks would go here if we populated questions
    // For now, we trust the manual input or handle it in the controller
    next();
});

module.exports = mongoose.model('Test', TestSchema);
