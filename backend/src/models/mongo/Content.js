const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    contentId: { type: String, required: true, unique: true }, // Ideally generated content ID
    title: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        enum: ['module', 'ppt', 'pyq'],
        required: true
    },
    subject: { type: String, required: true }, // e.g., "Data Structures"
    branch: { type: String, required: true }, // e.g., "CSE"
    semester: { type: Number, required: true }, // e.g., 3
    fileUrl: { type: String, required: true },
    fileType: { type: String }, // e.g., "pdf", "ppt", "doc"
    uploadedBy: { type: String, required: true }, // Faculty ID or name
    createdAt: { type: Date, default: Date.now }
});

// Index for efficient querying by student
contentSchema.index({ branch: 1, semester: 1, subject: 1, type: 1 });

module.exports = mongoose.model('Content', contentSchema);
