<<<<<<< HEAD:backend/src/modules/faculty/routes/facultyAnalyticsRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/facultyAnalyticsController');
const { verifyToken, verifyFaculty } = require('../../../middlewares/authMiddleware');

router.use(verifyToken);
router.use(verifyFaculty);

router.get('/dashboard-stats', controller.getFacultyDashboardStats);
router.get('/section-performance', controller.getSectionPerformance);
router.get('/activity-metrics', controller.getActivityMetrics);
router.get('/success-rates', controller.getSuccessRates);
router.get('/insights', controller.getFacultyInsights);

module.exports = router;
=======
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
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34:backend/src/routes/facultyAnalyticsRoutes.js
