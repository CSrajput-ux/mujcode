const mongoose = require('mongoose');

const userCourseSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0, min: 0, max: 100 }, // Percentage
    problemsSolved: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['ongoing', 'completed'],
        default: 'ongoing'
    },
    lastActiveAt: { type: Date, default: Date.now }
});

// Compound index for efficient queries
userCourseSchema.index({ userId: 1, courseId: 1 });

module.exports = mongoose.model('UserCourse', userCourseSchema);
