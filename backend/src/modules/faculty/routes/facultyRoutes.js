// File: src/routes/facultyRoutes.js
const express = require('express');
const router = express.Router();
const { updateFacultyProfile, getTeachingMap, getFacultyProfile, getAllFaculty } = require('../controllers/facultyController');
const { getStellaProfile } = require('../controllers/facultyStellaController');
const { getMentorRequests, approveMentor, bulkApprove, rejectMentor } = require('../controllers/facultyMentorController');
const authMiddleware = require('../../../middlewares/authMiddleware');

// Get all faculty (for mentor selection)
router.get('/', getAllFaculty);

// Get profile
router.get('/profile/:userId', getFacultyProfile);

// Get MUJ Stella profile by email
router.get('/stella-profile/:email', getStellaProfile);

// Update profile (Faculty only)
router.put('/profile/:facultyId', authMiddleware, updateFacultyProfile);

// Get teaching map for students (Public/Student)
router.get('/teaching-map', getTeachingMap);

// Mentor Management
router.get('/mentor-requests', authMiddleware, getMentorRequests);
router.patch('/approve-mentor/:requestId', authMiddleware, approveMentor);
router.patch('/bulk-approve', authMiddleware, bulkApprove);
router.patch('/reject-mentor/:requestId', authMiddleware, rejectMentor);

module.exports = router;
