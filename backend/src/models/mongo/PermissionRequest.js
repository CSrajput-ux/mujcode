const mongoose = require('mongoose');

const actionHistorySchema = new mongoose.Schema({
    facultyId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    action: { type: String, enum: ['approved', 'denied'], required: true },
    ip: { type: String },
    reason: { type: String }
});

const permissionRequestSchema = new mongoose.Schema({
    studentId: { type: String, required: true, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    section: { type: String, required: true },
    requestedAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'approved', 'denied'],
        default: 'pending'
    },
    reviewedByFacultyId: { type: String }, // User UUID of faculty
    actionHistory: [actionHistorySchema]
}, { timestamps: true });

// Index for filtering
permissionRequestSchema.index({ studentId: 1, status: 1 });
permissionRequestSchema.index({ courseId: 1, section: 1 });

module.exports = mongoose.model('PermissionRequest', permissionRequestSchema);
