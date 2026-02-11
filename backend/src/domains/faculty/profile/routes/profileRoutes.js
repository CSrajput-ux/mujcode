// File: src/routes/facultyRoutes.js
const express = require('express');
const router = express.Router();
const { updateFacultyProfile, getTeachingMap, getFacultyProfile } = require('../controllers/facultyController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get profile
router.get('/profile/:userId', getFacultyProfile);

// Update profile (Faculty only)
router.put('/profile/:facultyId', authMiddleware, updateFacultyProfile);

// Get teaching map for students (Public/Student)
router.get('/teaching-map', getTeachingMap);

module.exports = router;
