const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
        // e.g., "CSE", "ECE", "ME", "CE"
    },
    name: {
        type: String,
        required: true,
        trim: true
        // e.g., "Computer Science and Engineering"
    },
    fullName: {
        type: String,
        required: true
        // e.g., "Bachelor of Technology in Computer Science and Engineering"
    },
    department: {
        type: String,
        required: true
        // e.g., "Department of Computer Science and Engineering"
    },
    duration: {
        type: Number,
        default: 8,
        required: true
        // Total semesters (usually 8 for B.Tech)
    },
    totalYears: {
        type: Number,
        default: 4,
        required: true
    },
    specializations: [{
        type: String,
        trim: true
        // e.g., ["AI & Machine Learning", "Cyber Security", "Cloud Computing"]
    }],
    description: {
        type: String,
        default: ''
        // Brief description of the branch
    },
    isActive: {
        type: Boolean,
        default: true
        // For soft delete or temporarily disable branches
    },
    admissionCapacity: {
        type: Number,
        default: 60
        // Number of students admitted per year
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
branchSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Branch', branchSchema);
