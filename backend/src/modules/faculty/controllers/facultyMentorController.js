const mongoose = require('mongoose');
const MentorRequest = require('../../../models/mongo/MentorRequest');
const Faculty = require('../../../models/mongo/Faculty');
const StudentProgress = require('../../../models/mongo/StudentProgress');

// GET /api/faculty/mentor-requests
exports.getMentorRequests = async (req, res) => {
    try {
        const facultyUser = await Faculty.findOne({ userId: req.user.id });
        if (!facultyUser) {
            return res.status(404).json({ error: 'Faculty profile not found' });
        }

        const requests = await MentorRequest.find({
            facultyId: facultyUser._id,
            status: 'pending'
        }).sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH /api/faculty/approve-mentor/:requestId
exports.approveMentor = async (req, res) => {
    try {
        const { requestId } = req.params;
        const facultyUser = await Faculty.findOne({ userId: req.user.id });

        if (!facultyUser) {
            return res.status(404).json({ error: 'Faculty profile not found' });
        }

        const request = await MentorRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        if (request.facultyId.toString() !== facultyUser._id.toString()) {
            return res.status(403).json({ error: 'You can only approve requests sent to you' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ error: 'Request is already processed' });
        }

        // 1. Update Request Status
        request.status = 'approved';
        await request.save();

        // 2. Add student to Faculty mentees
        await Faculty.findByIdAndUpdate(
            facultyUser._id,
            { $addToSet: { mentees: request.studentId } }
        );

        // 3. Update StudentProgress
        await StudentProgress.findOneAndUpdate(
            { userId: request.studentId },
            {
                $addToSet: { selectedMentors: facultyUser._id },
                $set: { mentorSelectionLocked: true }
            },
            { upsert: true }
        );

        res.status(200).json({ message: 'Request approved successfully', request });

    } catch (error) {
        console.error('Approve Mentor Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// PATCH /api/faculty/bulk-approve
exports.bulkApprove = async (req, res) => {
    try {
        const { section, academicYear, semester } = req.body;
        const facultyUser = await Faculty.findOne({ userId: req.user.id });

        if (!facultyUser) {
            return res.status(404).json({ error: 'Faculty profile not found' });
        }

        const requests = await MentorRequest.find({
            facultyId: facultyUser._id,
            section,
            academicYear,
            semester,
            status: 'pending'
        });

        if (requests.length === 0) {
            return res.status(404).json({ error: 'No pending requests found for this criteria' });
        }

        const studentIds = requests.map(r => r.studentId);

        // 1. Update Requests Status
        await MentorRequest.updateMany(
            { _id: { $in: requests.map(r => r._id) } },
            { $set: { status: 'approved' } }
        );

        // 2. Update Faculty mentees
        await Faculty.findByIdAndUpdate(
            facultyUser._id,
            { $addToSet: { mentees: { $each: studentIds } } }
        );

        // 3. Update StudentProgress for all
        for (const sId of studentIds) {
            await StudentProgress.findOneAndUpdate(
                { userId: sId },
                {
                    $addToSet: { selectedMentors: facultyUser._id },
                    $set: { mentorSelectionLocked: true }
                },
                { upsert: true }
            );
        }

        res.status(200).json({
            message: `Successfully approved ${requests.length} students from Section ${section}`,
            count: requests.length
        });

    } catch (error) {
        console.error('Bulk Approve Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// PATCH /api/faculty/reject-mentor/:requestId
exports.rejectMentor = async (req, res) => {
    try {
        const { requestId } = req.params;
        const facultyUser = await Faculty.findOne({ userId: req.user.id });

        const request = await MentorRequest.findById(requestId);
        if (!request) return res.status(404).json({ error: 'Request not found' });

        if (request.facultyId.toString() !== facultyUser._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        request.status = 'rejected';
        await request.save();

        // Unlock student selection if rejected
        await StudentProgress.findOneAndUpdate(
            { userId: request.studentId },
            { mentorSelectionLocked: false }
        );

        res.status(200).json({ message: 'Request rejected', request });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
