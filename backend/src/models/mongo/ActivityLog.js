const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['student', 'faculty', 'company', 'placement'],
        index: true
    },
    action: {
        type: String,
        required: true,
        enum: ['registered', 'added', 'onboarded', 'created', 'updated', 'deleted']
    },
    message: {
        type: String,
        required: true
    },
    detail: {
        type: String,
        default: ''
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: -1  // Index for descending sort (latest first)
    }
}, {
    timestamps: false  // We're managing createdAt manually
});

// Index for efficient querying by type and time
activityLogSchema.index({ type: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
