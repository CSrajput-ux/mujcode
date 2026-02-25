// File: src/routes/studentProfileRoutes.js
const express = require('express');
const router = express.Router();
const { updateProfile, getProfile } = require('../controllers/studentProfileController');
const { assignMentors, getMentorStatus, requestMentor } = require('../controllers/studentMentorController');
const authMiddleware = require('../../../middlewares/authMiddleware');

router.put('/profile', authMiddleware, updateProfile); // Changed from /profile/:userId to /profile
router.get('/profile/:userId', getProfile);

// Mentor assignment routes
router.post('/assign-mentors', authMiddleware, assignMentors);
router.post('/request-mentor', authMiddleware, requestMentor);
router.get('/mentor-status', authMiddleware, getMentorStatus);

module.exports = router;
