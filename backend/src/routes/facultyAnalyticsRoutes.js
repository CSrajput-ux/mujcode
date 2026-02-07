const express = require('express');
const router = express.Router();
const controller = require('../controllers/analyticsController');

router.get('/dashboard-stats', controller.getFacultyDashboardStats);
router.get('/section-performance', controller.getSectionPerformance);
router.get('/activity-metrics', controller.getActivityMetrics);
router.get('/success-rates', controller.getSuccessRates);

module.exports = router;
