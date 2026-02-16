const PermissionRequest = require('../models/mongo/PermissionRequest');
const Permission = require('../models/mongo/Permission');
const Faculty = require('../models/mongo/Faculty');
const Course = require('../models/mongo/Course');

// @desc    Get all permission requests for faculty sections
// @route   GET /api/permissions
const getPermissionRequests = async (req, res) => {
    try {
        const { section, courseId, status } = req.query;
        const faculty = await Faculty.findOne({ userId: req.user.id });

        if (!faculty) {
            return res.status(404).json({ error: 'Faculty profile not found.' });
        }

        // Base query: Only sections assigned to faculty
        let query = {
            section: { $in: faculty.teachingAssignments.map(a => a.section) }
        };

        // Apply filters
        if (section) query.section = section;
        if (courseId) query.courseId = courseId;
        if (status) query.status = status;

        const requests = await PermissionRequest.find(query)
            .populate('courseId', 'title department')
            .sort({ requestedAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch permission requests.' });
    }
};

// @desc    Approve or Deny a permission request
// @route   PATCH /api/permissions/:id/status
const updatePermissionStatus = async (req, res) => {
    try {
        const { status, reason } = req.body;
        const requestId = req.params.id;

        const request = await PermissionRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: 'Request not found.' });
        }

        // Audit Logging
        const auditEntry = {
            facultyId: req.user.id,
            timestamp: new Date(),
            action: status,
            ip: req.ip,
            reason: reason || ''
        };

        request.status = status;
        request.reviewedByFacultyId = req.user.id;
        request.actionHistory.push(auditEntry);

        await request.save();

        res.json({ message: `Request ${status} successfully.`, request });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update request status.' });
    }
};

// --- NEW PERMISSION CONTROL SYSTEM (PHASE 15) ---

// @desc    Block features for student/section/course
// @route   POST /api/permissions/block
const createPermission = async (req, res) => {
    try {
        const { targetId, branch, section, blockedFeatures, reason, scope, semester, targetName } = req.body;

        // Validation
        if (!targetId || !blockedFeatures || blockedFeatures.length === 0) {
            return res.status(400).json({ error: 'Target and blocked features are required.' });
        }

        const newPermission = new Permission({
            scope, // 'student', 'section', 'course'
            targetId,
            targetName: targetName || targetId,
            branch,
            section: section || 'NA',
            semester: semester || 0,
            blockedFeatures,
            reason: reason || 'Restricted by Faculty',
            blockedBy: req.user.id, // From auth middleware
            status: 'active'
        });

        await newPermission.save();
        res.status(201).json({ message: 'Permission restrictions applied successfully.', permission: newPermission });

    } catch (error) {
        console.error('Error creating permission:', error);
        res.status(500).json({ error: 'Server error while applying permissions.' });
    }
};

// @desc    Get active permissions created by faculty
// @route   GET /api/permissions/blocks
const getPermissions = async (req, res) => {
    try {
        const { branch, section } = req.query;

        let query = { status: 'active' };

        // Faculty sees blocks they initiated
        if (req.user.role === 'faculty') {
            query.blockedBy = req.user.id;
        }

        if (branch) query.branch = branch;
        if (section) query.section = section;

        const permissions = await Permission.find(query).sort({ createdAt: -1 });
        res.status(200).json(permissions);

    } catch (error) {
        console.error('Error fetching permissions:', error);
        res.status(500).json({ error: 'Server error fetching permissions.' });
    }
};

// @desc    Revoke a permission block
// @route   DELETE /api/permissions/:id
const revokePermission = async (req, res) => {
    try {
        const { id } = req.params;

        const permission = await Permission.findById(id);
        if (!permission) {
            return res.status(404).json({ error: 'Permission record not found.' });
        }

        // Check ownership
        if (permission.blockedBy !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You authorized to revoke this permission.' });
        }

        permission.status = 'revoked';
        permission.updatedAt = Date.now();
        await permission.save();

        res.status(200).json({ message: 'Permission revoked successfully.' });

    } catch (error) {
        console.error('Error revoking permission:', error);
        res.status(500).json({ error: 'Server error revoking permission.' });
    }
};

module.exports = {
    getPermissionRequests,
    updatePermissionStatus,
    createPermission,
    getPermissions,
    revokePermission
};
