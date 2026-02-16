const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    type: {
        type: String,
        enum: ['MCQ', 'TrueFalse'],
        default: 'MCQ'
    },
    options: [{ type: String }], // Array of strings for options
    correctOption: { type: Number, required: true }, // Index of the correct option (0-based)
    marks: { type: Number, default: 1 },
    explanation: { type: String }, // Explanation for the answer
    topic: { type: String },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', QuestionSchema);
