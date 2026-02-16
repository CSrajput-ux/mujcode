<<<<<<< HEAD:backend/src/modules/admin/routes/adminSystemRoutes.js
const express = require('express');
const router = express.Router();
const adminSystemController = require('../controllers/adminSystemController');
const { verifyAdminToken } = require('../../../middlewares/authMiddleware');

// Apply admin authentication to all routes
router.use(verifyAdminToken);

/**
 * Activity Logs
 * GET /api/admin/system/activity-logs?limit=10&type=student
 */
router.get('/activity-logs', adminSystemController.getActivityLogs);

/**
 * System Health
 * GET /api/admin/system/health
 */
router.get('/health', adminSystemController.getSystemHealth);

/**
 * Server Uptime
 * GET /api/admin/system/uptime
 */
router.get('/uptime', adminSystemController.getUptime);

/**
 * Platform Statistics
 * GET /api/admin/system/stats
 */
router.get('/stats', adminSystemController.getPlatformStats);

/**
 * All Dashboard Data (Combined endpoint for efficiency)
 * GET /api/admin/system/dashboard-data
 */
router.get('/dashboard-data', adminSystemController.getDashboardData);

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const adminSystemController = require('../controllers/adminSystemController');
const { verifyAdminToken } = require('../middlewares/authMiddleware');

// Apply admin authentication to all routes
router.use(verifyAdminToken);

/**
 * Activity Logs
 * GET /api/admin/system/activity-logs?limit=10&type=student
 */
router.get('/activity-logs', adminSystemController.getActivityLogs);

/**
 * System Health
 * GET /api/admin/system/health
 */
router.get('/health', adminSystemController.getSystemHealth);

/**
 * Server Uptime
 * GET /api/admin/system/uptime
 */
router.get('/uptime', adminSystemController.getUptime);

/**
 * Platform Statistics
 * GET /api/admin/system/stats
 */
router.get('/stats', adminSystemController.getPlatformStats);

/**
 * All Dashboard Data (Combined endpoint for efficiency)
 * GET /api/admin/system/dashboard-data
 */
router.get('/dashboard-data', adminSystemController.getDashboardData);

module.exports = router;
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34:backend/src/routes/adminSystemRoutes.js
