const mongoose = require('mongoose');

const TheoryQuestionSchema = new mongoose.Schema({
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
    modelAnswer: {
        type: String,
        required: true
    }, // Faculty's model/reference answer
    keywords: [{
        type: String
    }], // Important keywords for AI evaluation
    maxMarks: {
        type: Number,
        required: true,
        min: 0
    },
    evaluationCriteria: {
        conceptualWeight: { type: Number, default: 40 }, // percentage
        keywordWeight: { type: Number, default: 30 },
        explanationWeight: { type: Number, default: 20 },
        relevanceWeight: { type: Number, default: 10 }
    },
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
TheoryQuestionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Validate evaluation criteria weights sum to 100
TheoryQuestionSchema.pre('save', function (next) {
    const { conceptualWeight, keywordWeight, explanationWeight, relevanceWeight } = this.evaluationCriteria;
    const total = conceptualWeight + keywordWeight + explanationWeight + relevanceWeight;

    if (total !== 100) {
        return next(new Error('Evaluation criteria weights must sum to 100'));
    }
    next();
});

module.exports = mongoose.model('TheoryQuestion', TheoryQuestionSchema);
