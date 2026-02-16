const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    department: { type: String, required: true },
    sectionsAllowed: [{ type: String }],
    createdByFacultyId: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['C', 'C++', 'Java', 'Python', 'SQL', 'JavaScript', 'DSA', 'Interview']
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    totalProblems: { type: Number, default: 0 },
    icon: { type: String, default: 'code' }, // code, database, globe, etc.
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
