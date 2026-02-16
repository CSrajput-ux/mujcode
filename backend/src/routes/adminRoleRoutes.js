const express = require('express');
const router = express.Router();
const adminRoleController = require('../controllers/adminRoleController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// View Roles - Accessible to Admin, TPO, Dean, etc? Or just Admin?
// Let's allow authenticated users to see roles (maybe for dropdowns) or restrict to Admin.
router.get('/', authorize('admin', 'superadmin'), adminRoleController.getRoles);

// Assignments
router.get('/assignments', authorize('admin', 'superadmin'), adminRoleController.getRoleAssignments);
router.post('/assign', authorize('admin', 'superadmin'), adminRoleController.assignRole);

module.exports = router;
