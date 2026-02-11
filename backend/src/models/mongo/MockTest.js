const mongoose = require('mongoose');

const MockTestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    duration: {
        type: Number,
        required: true
    }, // Duration in minutes
    totalQuestions: {
        type: Number,
        required: true
    }, // Total questions in pool
    questionsPerAttempt: {
        type: Number,
        required: true
    }, // Questions to show per attempt
    attemptsAllowed: {
        type: Number,
        default: -1
    }, // -1 for unlimited, else specific count
    isActive: {
        type: Boolean,
        default: true
    },
    category: {
        type: String
    }, // "Programming", "DSA", "Web Dev", etc.
    tags: [String],
    passingPercentage: {
        type: Number,
        default: 40
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

// Add text index for search functionality
MockTestSchema.index({ title: 'text', description: 'text' });

// Update timestamp on save
MockTestSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('MockTest', MockTestSchema);
