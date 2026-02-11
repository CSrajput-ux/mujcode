const mongoose = require('mongoose');

const MCQQuestionSchema = new mongoose.Schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true,
        index: true
    },
    questionText: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return this.options.length === 4;
            },
            message: 'MCQ must have exactly 4 options'
        }
    }],
    correctAnswers: [{
        type: Number,
        required: true,
        min: 0,
        max: 3,
        validate: {
            validator: function (v) {
                return this.correctAnswers.length > 0 && this.correctAnswers.length <= 4;
            },
            message: 'Must have at least 1 and at most 4 correct answers'
        }
    }],
    multipleCorrect: {
        type: Boolean,
        default: false
    },
    marks: {
        type: Number,
        required: true,
        default: 1,
        min: 0
    },
    explanation: {
        type: String
    }, // Optional explanation shown after test completion
    order: {
        type: Number,
        default: 0
    }, // Question order in test
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
MCQQuestionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Validate multiple correct answers flag
MCQQuestionSchema.pre('save', function (next) {
    if (this.correctAnswers.length > 1 && !this.multipleCorrect) {
        this.multipleCorrect = true;
    }
    next();
});

module.exports = mongoose.model('MCQQuestion', MCQQuestionSchema);
