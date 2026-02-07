const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    count: { type: Number, default: 0 }
}, {
    timestamps: true
});

// Compound index for unique daily entries per user
ActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Activity', ActivitySchema);
