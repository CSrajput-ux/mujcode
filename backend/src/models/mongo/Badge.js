// File: src/models/mongo/Badge.js
const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    icon: String,
    category: {
        type: String,
        enum: ['streak', 'course', 'problem', 'achievement'],
        default: 'achievement'
    },
    requirement: {
        type: String, // e.g., "Solve 50 Easy problems", "Complete DSA course"
        required: true
    }
}, {
    timestamps: true
});

const userBadgeSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
        ref: 'User'
    },
    badges: [{
        badgeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Badge'
        },
        earnedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const Badge = mongoose.model('Badge', badgeSchema);
const UserBadge = mongoose.model('UserBadge', userBadgeSchema);

module.exports = { Badge, UserBadge };
