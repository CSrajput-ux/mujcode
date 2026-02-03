// File: src/routes/studentProgressRoutes.js
const express = require('express');
const router = express.Router();
const {
    getStudentStats,
    getStudentRankings,
    getStudentBadges,
    getStudentActivity
} = require('../controllers/studentProgressController');

// Student Progress Routes
router.get('/stats/:studentId', getStudentStats);
router.get('/rankings/:studentId', getStudentRankings);
router.get('/badges/:studentId', getStudentBadges);
router.get('/activity/:studentId', getStudentActivity);

module.exports = router;
