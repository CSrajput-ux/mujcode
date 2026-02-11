const express = require('express');
const router = express.Router();
const controller = require('../controllers/analyticsController');
const { verifyToken, verifyFaculty } = require('../middlewares/authMiddleware');

router.use(verifyToken);
router.use(verifyFaculty);

router.get('/dashboard-stats', controller.getFacultyDashboardStats);
router.get('/section-performance', controller.getSectionPerformance);
router.get('/activity-metrics', controller.getActivityMetrics);
router.get('/success-rates', controller.getSuccessRates);
router.get('/insights', controller.getFacultyInsights);

module.exports = router;
