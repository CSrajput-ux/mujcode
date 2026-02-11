const mongoose = require('mongoose');

const MockAttemptSchema = new mongoose.Schema({
    mockTestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MockTest',
        required: true,
        index: true
    },
    studentId: {
        type: String,
        required: true,
        index: true
    },
    attemptNumber: {
        type: Number,
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MockQuestion'
    }], // Randomized questions for this attempt
    answers: [{
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOption: Number,
        isCorrect: Boolean,
        markedForReview: {
            type: Boolean,
            default: false
        }
    }],
    score: {
        type: Number,
        default: 0
    },
    maxScore: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        default: 0
    },
    timeTaken: {
        type: Number
    }, // Time taken in seconds
    startedAt: {
        type: Date,
        default: Date.now
    },
    submittedAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['in-progress', 'submitted'],
        default: 'in-progress'
    }
});

// Compound index for efficient queries
MockAttemptSchema.index({ mockTestId: 1, studentId: 1, status: 1 });

module.exports = mongoose.model('MockAttempt', MockAttemptSchema);
