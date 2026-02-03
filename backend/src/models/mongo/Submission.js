const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    userId: String,
    problemId: String, // Stores problem number as string (e.g., "1", "2")
    code: String,
    language: String,
    mode: { type: String, enum: ['run', 'submit'], default: 'submit' }, // NEW: Run vs Submit
    verdict: {
        type: String,
        enum: ['Pending', 'Accepted', 'Wrong Answer', 'Error', 'Time Limit Exceeded',
            'Runtime Error', 'Compilation Error', 'Run Successful', 'System Error'],
        default: 'Pending'
    },
    output: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);