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
    completedTests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
    completedAssignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
    selectedMentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }],
    mentorSelectionLocked: { type: Boolean, default: false },
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

// Method to add points for completed Test
studentProgressSchema.methods.addTestPoints = async function (testId, points = 20) {
    // Check if points already awarded for this test (prevent double counting)
    // We can track this in a new field or just rely on controller logic.
    // Ideally, we should add a 'completedTests' array to track this.
    // For now, let's assume controller checks validity.

    // Better: Add to specific tracking array if not exists
    if (!this.completedTests) this.completedTests = [];
    if (this.completedTests.includes(testId)) return;

    this.completedTests.push(testId);
    this.totalPoints = (this.totalPoints || 0) + points;

    // Update activity
    const today = new Date().toISOString().split('T')[0];
    const existingActivity = this.activityMap.find(a =>
        a.date.toISOString().split('T')[0] === today
    );
    if (existingActivity) existingActivity.count += 1;
    else this.activityMap.push({ date: new Date(), count: 1 });

    this.lastActive = new Date();
    return await this.save();
};

// Method to add points for Assignments/Research/CaseStudy
studentProgressSchema.methods.addAssignmentPoints = async function (assignmentId, type) {
    let points = 0;
    if (type === 'CaseStudy') points = 50;
    else if (type === 'Research') points = 100;
    else points = 10; // Default assignment points

    // Add to specific tracking array
    if (!this.completedAssignments) this.completedAssignments = [];
    if (this.completedAssignments.includes(assignmentId)) return;

    this.completedAssignments.push(assignmentId);
    this.totalPoints = (this.totalPoints || 0) + points;

    // Update activity
    const today = new Date().toISOString().split('T')[0];
    const existingActivity = this.activityMap.find(a =>
        a.date.toISOString().split('T')[0] === today
    );
    if (existingActivity) existingActivity.count += 1;
    else this.activityMap.push({ date: new Date(), count: 1 });

    this.lastActive = new Date();
    return await this.save();
};

module.exports = mongoose.model('StudentProgress', studentProgressSchema);
