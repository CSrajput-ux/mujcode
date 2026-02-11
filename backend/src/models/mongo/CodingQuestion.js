const mongoose = require('mongoose');

const CodingQuestionSchema = new mongoose.Schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    problemStatement: {
        type: String,
        required: true
    }, // Supports markdown
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
        default: 'Medium'
    },
    allowedLanguages: [{
        type: String,
        required: true,
        enum: ['python', 'java', 'cpp', 'c', 'javascript']
    }],
    starterCode: [{
        language: {
            type: String,
            required: true,
            enum: ['python', 'java', 'cpp', 'c', 'javascript']
        },
        code: {
            type: String,
            default: ''
        }
    }],
    testCases: [{
        input: {
            type: String,
            required: true
        },
        expectedOutput: {
            type: String,
            required: true
        },
        marks: {
            type: Number,
            required: true,
            min: 0
        },
        isHidden: {
            type: Boolean,
            default: true
        }, // Hidden from students during test
        explanation: {
            type: String
        }
    }],
    totalMarks: {
        type: Number,
        required: true,
        min: 0
    },
    timeLimit: {
        type: Number,
        default: 5,
        min: 1,
        max: 30
    }, // seconds per test case
    memoryLimit: {
        type: Number,
        default: 256,
        min: 64,
        max: 1024
    }, // MB
    order: {
        type: Number,
        default: 0
    },
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
CodingQuestionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Calculate total marks from test cases if not set
CodingQuestionSchema.pre('save', function (next) {
    if (this.testCases && this.testCases.length > 0) {
        const calculatedTotal = this.testCases.reduce((sum, tc) => sum + tc.marks, 0);
        if (!this.totalMarks || this.totalMarks === 0) {
            this.totalMarks = calculatedTotal;
        }
    }
    next();
});

module.exports = mongoose.model('CodingQuestion', CodingQuestionSchema);
