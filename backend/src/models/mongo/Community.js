const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    sections: [String], // e.g. ['CSE-A', 'CSE-B']

    // Faculty who created/manages it
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Community', communitySchema);
