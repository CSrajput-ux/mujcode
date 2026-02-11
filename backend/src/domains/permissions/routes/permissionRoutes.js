const express = require('express');
const router = express.Router();
const { verifyToken, verifyFaculty } = require('../middlewares/authMiddleware');
const { verifySectionOwnership, verifyCourseAuthority } = require('../middlewares/permissionMiddleware');
const { getPermissionRequests, updatePermissionStatus } = require('../controllers/permissionController');

// All routes require faculty token
router.use(verifyToken);
router.use(verifyFaculty);

// GET /api/permissions - List requests
router.get('/', verifySectionOwnership, getPermissionRequests);

// PATCH /api/permissions/:id/status - Approve/Deny
// Note: Middleware will ensure faculty has authority over the section and course
router.patch('/:id/status', verifySectionOwnership, verifyCourseAuthority, updatePermissionStatus);

module.exports = router;
