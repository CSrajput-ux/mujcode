const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        enum: ['Assignment', 'CaseStudy', 'Research', 'Other'],
        default: 'Assignment'
    },
    subject: { type: String }, // e.g., "Data Structures"
    year: { type: String }, // e.g., "2", "3"
    branch: { type: String }, // e.g., "CSE"
    section: { type: String }, // e.g., "A", "B"
    dueDate: { type: Date },
    totalMarks: { type: Number, default: 100 },
    createdBy: { type: String }, // Faculty ID (mock for now if no auth)
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
