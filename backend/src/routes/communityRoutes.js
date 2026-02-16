const express = require('express');
const router = express.Router();
const Community = require('../models/mongo/Community');
const Post = require('../models/mongo/Post');
const { verifyToken, verifyFaculty } = require('../middlewares/authMiddleware');

// @route   POST /api/communities
// @desc    Create a new community
// @access  Faculty
router.post('/communities', verifyToken, verifyFaculty, async (req, res) => {
    try {
        const { name, description, sections } = req.body;

        const newCommunity = new Community({
            name,
            description,
            sections,
            createdBy: req.user.id
        });

        await newCommunity.save();
        res.status(201).json({ success: true, data: newCommunity });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   GET /api/communities
// @desc    Get all communities (Filtered for faculty)
// @access  Faculty
router.get('/communities', verifyToken, verifyFaculty, async (req, res) => {
    try {
        // Faculty sees communities they created OR all communities? 
        // User request: "Faculty can manage multiple communities"
        // Let's return communities created by this faculty.
        const communities = await Community.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: communities.length, data: communities });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   POST /api/communities/:id/posts
// @desc    Create a post in a community
// @access  Faculty (and Students in future)
router.post('/communities/:id/posts', verifyToken, async (req, res) => {
    try {
        const { content, attachments } = req.body;

        // Populate author info
        // Ideally we fetch name from User model, but for now using req.user or simplified
        // We need the User model to get the name if it's not in the token.
        // Assuming req.user has details or we just store ID.
        // Schema has authorName.

        // Fetch user basic info if needed, or just store ID
        // Let's store ID and fetch on Frontend or populate.
        // But schema has authorName.

        const newPost = new Post({
            communityId: req.params.id,
            authorId: req.user.id,
            authorRole: req.user.role, // assuming role is in token
            content,
            attachments
        });

        await newPost.save();
        res.status(201).json({ success: true, data: newPost });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   GET /api/communities/:id/posts
// @desc    Get all posts for a community
// @access  Authenticated Users
router.get('/communities/:id/posts', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ communityId: req.params.id })
            .sort({ createdAt: -1 })
            .populate('authorId', 'name') // Populate name from User model
            .populate('comments.authorId', 'name');

        res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
