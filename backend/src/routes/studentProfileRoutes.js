// File: src/routes/studentProfileRoutes.js
const express = require('express');
const router = express.Router();
const { updateProfile, getProfile } = require('../controllers/studentProfileController');

router.put('/profile/:userId', updateProfile);
router.get('/profile/:userId', getProfile);

module.exports = router;
