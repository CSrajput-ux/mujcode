const StudentProgress = require('../../../models/mongo/StudentProgress');
const Faculty = require('../../../models/mongo/Faculty');
const MentorRequest = require('../../../models/mongo/MentorRequest');
const StudentProfile = require('../../../models/pg/StudentProfile');

exports.requestMentor = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { facultyIds } = req.body;

        if (!facultyIds || !Array.isArray(facultyIds) || facultyIds.length === 0) {
            return res.status(400).json({ error: 'At least one Faculty ID is required' });
        }

        // 1. Get Student Profile from Postgres (Real Data)
        const profile = await StudentProfile.findOne({ where: { userId: studentId } });
        if (!profile) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        const requestsCreated = [];
        const errors = [];

        for (const facultyId of facultyIds) {
            try {
                // 2. Prevent duplicate/active requests for THIS faculty
                const existingRequest = await MentorRequest.findOne({
                    studentId,
                    facultyId,
                    status: { $in: ['pending', 'approved'] }
                });

                if (existingRequest) {
                    errors.push(`Request already exists for faculty ${facultyId}`);
                    continue;
                }

                // 3. Get Faculty Details
                const faculty = await Faculty.findById(facultyId);
                if (!faculty) {
                    errors.push(`Faculty ${facultyId} not found`);
                    continue;
                }

                // 4. Create Request
                const newRequest = new MentorRequest({
                    studentId,
                    facultyId,
                    studentName: req.user.name,
                    registrationId: profile.rollNumber || '---',
                    department: profile.department || '---',
                    section: profile.section || '---',
                    academicYear: profile.year ? `${profile.year}st Year` : '---',
                    semester: profile.semester ? `Semester ${profile.semester}` : '---',
                    status: 'pending'
                });
                await newRequest.save();
                requestsCreated.push(newRequest);

            } catch (err) {
                errors.push(`Error processing faculty ${facultyId}: ${err.message}`);
            }
        }

        // 5. Update StudentProgress to lock selection
        if (requestsCreated.length > 0) {
            await StudentProgress.findOneAndUpdate(
                { userId: studentId },
                { mentorSelectionLocked: true },
                { upsert: true }
            );
        }

        if (requestsCreated.length === 0 && errors.length > 0) {
            return res.status(400).json({ error: errors[0], allErrors: errors });
        }

        res.status(201).json({
            message: `Successfully sent ${requestsCreated.length} mentor request(s)`,
            requests: requestsCreated,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Request Mentor Error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getMentorStatus = async (req, res) => {
    try {
        const studentId = req.user.id;

        // 1. Get all requests
        const requests = await MentorRequest.find({ studentId })
            .populate('facultyId', 'name department designation');

        // 2. Get student progress with approved mentors
        const studentProgress = await StudentProgress.findOne({ userId: studentId })
            .populate('selectedMentors', 'name department designation');

        res.status(200).json({
            requests,
            selectedMentors: studentProgress?.selectedMentors || [],
            mentorSelectionLocked: studentProgress?.mentorSelectionLocked || false
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.assignMentors = async (req, res) => {
    // legacy endpoint, redirect to new workflow error to avoid hang
    return res.status(400).json({
        error: 'This operation is deprecated. Please use the Mentor Approval Workflow (/api/student/request-mentor).'
    });
};
