const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Store as String to match SQL UUID
    problemId: { type: String, required: true }, // Store Problem Number as String (e.g., "1")
    code: { type: String, required: true },
    language: { type: String, required: true },
    mode: { type: String, enum: ['run', 'submit', 'dry-run'], default: 'submit' },
    verdict: {
        type: String,
        enum: ['Pending', 'Accepted', 'Wrong Answer', 'Error', 'Time Limit Exceeded',
            'Runtime Error', 'Compilation Error', 'Run Successful', 'System Error'],
        default: 'Pending'
    },
    output: String,
    passedTestCases: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
    executionTime: { type: Number, default: 0 }, // in ms
    memoryUsed: { type: Number, default: 0 }, // in KB
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);