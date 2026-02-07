// File: src/models/mongo/Faculty.js
const mongoose = require('mongoose');

const teachingAssignmentSchema = new mongoose.Schema({
    year: { type: String, required: true }, // e.g., "1st Year"
    section: { type: String, required: true }, // e.g., "A"
    branch: { type: String, required: true }, // e.g., "CSE"
    subject: { type: String, required: true } // e.g., "Data Structures"
});

const facultySchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, // Maps to Postgres User UUID
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    facultyId: { type: String, required: true, unique: true }, // Employee ID
    department: { type: String, required: true },
    designation: { type: String, required: true },
    teachingAssignments: [teachingAssignmentSchema]
}, { timestamps: true });

// Index for fast student lookups
facultySchema.index({
    'teachingAssignments.year': 1,
    'teachingAssignments.section': 1,
    'teachingAssignments.branch': 1
});

module.exports = mongoose.model('Faculty', facultySchema);
