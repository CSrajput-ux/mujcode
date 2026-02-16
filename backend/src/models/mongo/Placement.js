const mongoose = require('mongoose');

const PlacementSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    skills: [{
        type: String,
        trim: true
    }],
    eligibilityCriteria: {
        minCGPA: {
            type: Number,
            default: 0
        },
        allowedBranches: [{
            type: String,
            trim: true
        }],
        allowedYears: [{
            type: Number
        }]
    },
    salary: {
        min: {
            type: Number
        },
        max: {
            type: Number
        },
        currency: {
            type: String,
            default: 'INR'
        }
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'closed', 'cancelled'],
        default: 'draft'
    },
    deadline: {
        type: Date,
        required: true
    },
    applicationStartDate: {
        type: Date
    },
    interviewDate: {
        type: Date
    },
    numberOfPositions: {
        type: Number,
        default: 1
    },
    applicants: [{
        studentId: {
            type: String // PostgreSQL UUID
        },
        appliedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['applied', 'shortlisted', 'rejected', 'selected', 'withdrawn'],
            default: 'applied'
        }
    }],
    createdBy: {
        type: String // Admin/Faculty user ID
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Indexes for fast queries
PlacementSchema.index({ status: 1, deadline: 1 }); // For active placements query
PlacementSchema.index({ companyId: 1 });
PlacementSchema.index({ createdAt: -1 });
PlacementSchema.index({ 'applicants.studentId': 1 });

module.exports = mongoose.model('Placement', PlacementSchema);
