const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true }, // Markdown supported
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    topic: { type: String }, // e.g., "Arrays", "Loops"
    tags: [String], // e.g., "Two Pointers"

    type: {
        type: String,
        enum: ['coding', 'theory'],
        required: true
    },

    // --- Coding Question Fields ---
    languages: [String], // e.g. ['c', 'cpp', 'java', 'python']
    testCases: [{
        input: String,
        output: String,
        isSample: { type: Boolean, default: false }
    }],
    defaultCode: [{
        language: String,
        code: String
    }],

    // --- Access Control ---
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Faculty ID
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Question', questionSchema);
