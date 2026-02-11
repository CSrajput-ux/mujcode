const express = require('express');
const router = express.Router();
const {
    getPermissionRequests,
    updatePermissionStatus,
    createPermission,
    getPermissions,
    revokePermission
} = require('../controllers/permissionController');
const { verifyToken, verifyFaculty } = require('../middlewares/authMiddleware');

// --- Legacy Permission Requests (Approvals) ---
router.get('/', verifyToken, verifyFaculty, getPermissionRequests);
router.patch('/:id/status', verifyToken, verifyFaculty, updatePermissionStatus);


// --- NEW PERMISSION CONTROL SYSTEM (PHASE 15) ---

// Create a new block (Faculty Only)
router.post('/block', verifyToken, verifyFaculty, createPermission);

// List active blocks (Faculty Only)
router.get('/blocks', verifyToken, verifyFaculty, getPermissions);

// Revoke a block (Faculty Only - Owner check in controller)
router.delete('/:id', verifyToken, verifyFaculty, revokePermission);

module.exports = router;
