// File: src/routes/studentProfileRoutes.js
const express = require('express');
const router = express.Router();
const { updateProfile, getProfile } = require('../controllers/studentProfileController');
const authMiddleware = require('../middlewares/authMiddleware');

router.put('/profile', authMiddleware, updateProfile); // Changed from /profile/:userId to /profile
router.get('/profile/:userId', getProfile);

module.exports = router;
