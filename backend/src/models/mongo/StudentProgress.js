// File: src/models/mongo/StudentProgress.js
const mongoose = require('mongoose');

const studentProgressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        ref: 'User'
    },
    solvedProblems: {
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 }
    },
    totalSolved: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 }, // Points earned from solving problems
    solvedProblemIds: [{ type: Number }], // Array of problem numbers that are solved
    submissions: [{
        problemId: mongoose.Schema.Types.ObjectId,
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
        solvedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['accepted', 'failed'], default: 'accepted' }
    }],
    activityMap: [{
        date: Date,
        count: Number
    }],
    lastActive: Date
}, {
    timestamps: true
});

// Method to update solved count
studentProgressSchema.methods.addSolvedProblem = async function (problemId, difficulty, problemNumber, points) {
    // Check if already solved
    if (this.solvedProblemIds && this.solvedProblemIds.includes(problemNumber)) {
        return await this.save(); // Already solved
    }

    // Add to solved problems array
    if (!this.solvedProblemIds) this.solvedProblemIds = [];
    this.solvedProblemIds.push(problemNumber);

    // Update counts
    this.solvedProblems[difficulty] += 1;
    this.totalSolved += 1;
    this.totalPoints = (this.totalPoints || 0) + points;

    this.submissions.push({
        problemId,
        difficulty,
        solvedAt: new Date(),
        status: 'accepted'
    });

    // Update activity map
    const today = new Date().toISOString().split('T')[0];
    const existingActivity = this.activityMap.find(a =>
        a.date.toISOString().split('T')[0] === today
    );

    if (existingActivity) {
        existingActivity.count += 1;
    } else {
        this.activityMap.push({ date: new Date(), count: 1 });
    }

    this.lastActive = new Date();
    return await this.save();
};

module.exports = mongoose.model('StudentProgress', studentProgressSchema);
