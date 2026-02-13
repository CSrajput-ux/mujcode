const mongoose = require('mongoose');

const MockQuestionSchema = new mongoose.Schema({
    mockTestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MockTest',
        required: true,
        index: true
    },
    questionText: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctOption: {
        type: Number,
        required: true
    }, // Index of correct option (0-based)
    explanation: {
        type: String
    }, // Detailed explanation for the answer
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    points: {
        type: Number,
        default: 5
    }, // Marks for this question
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure correctOption is within valid range
MockQuestionSchema.pre('save', function (next) {
    if (this.correctOption < 0 || this.correctOption >= this.options.length) {
        next(new Error('correctOption must be a valid index within options array'));
    }
    next();
});

module.exports = mongoose.model('MockQuestion', MockQuestionSchema);
