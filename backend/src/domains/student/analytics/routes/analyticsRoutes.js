// File: src/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const {
    getPerformanceTrend,
    getTopicPerformance,
    getImprovementAreas,
    getTestsSummary
} = require('../controllers/analyticsController');

router.get('/analytics/trend/:studentId', getPerformanceTrend);
router.get('/analytics/topics/:studentId', getTopicPerformance);
router.get('/analytics/improvement/:studentId', getImprovementAreas);
router.get('/analytics/summary/:studentId', getTestsSummary);

module.exports = router;
