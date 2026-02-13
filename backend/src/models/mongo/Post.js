const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String }, // Cache name to avoid lookups
    authorRole: { type: String, enum: ['student', 'faculty', 'admin'] },

    content: { type: String, required: true }, // Markdown/Text
    attachments: [{
        type: String, // URL
        name: String
    }],

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    comments: [{
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        authorName: String,
        content: String,
        createdAt: { type: Date, default: Date.now }
    }],

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
