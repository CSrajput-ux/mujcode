const PermissionRequest = require('../models/mongo/PermissionRequest');
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

module.exports = {
    getPermissionRequests,
    updatePermissionStatus
};
