// File: src/routes/studentProgressRoutes.js
const express = require('express');
const router = express.Router();
const {
    getStudentStats,
    getStudentRankings,
    getStudentBadges,
    getStudentActivity,
    getUserProblemStats,
    getHeatmap
} = require('../controllers/studentProgressController');

// Student Progress Routes
router.get('/heatmap/:studentId', getHeatmap); // New Activity Collection Heatmap
router.get('/problem-stats/:userId', getUserProblemStats); // Real-time aggregation endpoint
router.get('/stats/:studentId', getStudentStats);
router.get('/rankings/:studentId', getStudentRankings);
router.get('/badges/:studentId', getStudentBadges);
router.get('/activity/:studentId', getStudentActivity);

module.exports = router;
