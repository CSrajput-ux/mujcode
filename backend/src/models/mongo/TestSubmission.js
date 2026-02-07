const mongoose = require('mongoose');

const TestSubmissionSchema = new mongoose.Schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    studentId: {
        type: String, // Assuming studentId is a string from Auth (or ObjectId if using User model)
        required: true
    },
    startTime: { type: Date, default: Date.now },
    submitTime: { type: Date },
    answers: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selectedOption: { type: Number } // Index of selected option
    }],
    score: { type: Number, default: 0 },
    totalMaxScore: { type: Number },
    status: {
        type: String,
        enum: ['In Progress', 'Submitted', 'Graded'],
        default: 'In Progress'
    },
    warningsIssued: { type: Number, default: 0 }, // For proctored tests
    violationLogs: [{
        reason: String,
        timestamp: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('TestSubmission', TestSubmissionSchema);
