const mongoose = require('mongoose');

const AssignmentSubmissionSchema = new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: String, required: true }, // Auth ID
    studentName: { type: String }, // De-normalized for easier display
    rollNumber: { type: String },
    files: [{ type: String }], // URLs to uploaded files
    status: {
        type: String,
        enum: ['Pending', 'Submitted', 'Graded', 'Late'],
        default: 'Pending'
    },
    marks: { type: Number },
    feedback: { type: String },
    submittedAt: { type: Date }
});

module.exports = mongoose.model('AssignmentSubmission', AssignmentSubmissionSchema);
