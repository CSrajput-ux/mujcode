const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    points: {
        type: Number, default: function () {
            // Auto-assign points based on difficulty
            if (this.difficulty === 'Easy') return 5;
            if (this.difficulty === 'Medium') return 7;
            if (this.difficulty === 'Hard') return 10;
            return 5;
        }
    },
    category: {
        type: String,
        enum: [
            'Algorithms',
            'Database',
            'Shell',
            'Concurrency',
            'JavaScript',
            'C Programming',
            'Python',
            'OOPs',
            'Data Structures',
            'Web Development',
            'Operating Systems',
            'Computer Networks',
            'Cloud Computing',
            'DevOps'
        ],
        default: 'Algorithms'
    },
    topic: { type: String, required: true }, // e.g., Arrays, Trees, DP, etc.
    tags: [String], // e.g., ["Array", "Hash Table", "Two Pointers"]
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Link to course
    acceptanceRate: { type: Number, default: 0 }, // percentage (0-100)
    totalSubmissions: { type: Number, default: 0 },
    acceptedSubmissions: { type: Number, default: 0 },
    testCases: [{
        input: String,
        output: String
    }],
    constraints: [String],
    examples: [{
        input: String,
        output: String,
        explanation: String
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Problem', ProblemSchema);