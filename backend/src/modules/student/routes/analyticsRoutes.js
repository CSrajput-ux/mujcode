<<<<<<< HEAD:backend/src/modules/student/routes/analyticsRoutes.js
// File: src/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const {
    getPerformanceTrend,
    getTopicPerformance,
    getImprovementAreas,
    getTestsSummary
} = require('../controllers/studentAnalyticsController');

router.get('/analytics/trend/:studentId', getPerformanceTrend);
router.get('/analytics/topics/:studentId', getTopicPerformance);
router.get('/analytics/improvement/:studentId', getImprovementAreas);
router.get('/analytics/summary/:studentId', getTestsSummary);

module.exports = router;
=======
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
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34:backend/src/routes/analyticsRoutes.js
