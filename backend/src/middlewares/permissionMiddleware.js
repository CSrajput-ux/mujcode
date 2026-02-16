const Faculty = require('../models/mongo/Faculty');
const Course = require('../models/mongo/Course');
const Permission = require('../models/mongo/Permission');

const verifySectionOwnership = async (req, res, next) => {
    try {
        const faculty = await Faculty.findOne({ userId: req.user.id });
        if (!faculty) {
            return res.status(403).json({ error: 'Faculty profile not found.' });
        }

        const requestedSection = req.body.section || req.query.section;
        if (!requestedSection) {
            return next(); // If no section requested, proceed (filtering might happen later)
        }

        const hasSection = faculty.teachingAssignments.some(assign => assign.section === requestedSection);
        if (!hasSection) {
            return res.status(403).json({ error: `Not authorized for section ${requestedSection}` });
        }

        req.facultyContext = faculty;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Authorization error.' });
    }
};

const verifyCourseAuthority = async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const faculty = req.facultyContext || await Faculty.findOne({ userId: req.user.id });

        if (!faculty) {
            return res.status(403).json({ error: 'Faculty profile not found.' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found.' });
        }

        // Rule: Same department AND (Teaching OR Created)
        const isAuthoritative = course.department === faculty.department && (
            faculty.teachingCourses.includes(courseId) ||
            course.createdByFacultyId === faculty.userId
        );

        if (!isAuthoritative) {
            return res.status(403).json({ error: 'Not authorized for this course.' });
        }

        req.courseContext = course;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Authorization error.' });
    }
};

// --- NEW PERMISSION ENFORCEMENT (PHASE 15) ---
// Middleware to check if a student is blocked from a specific feature
// Usage: router.get('/tests', protect, checkPermission('tests'), getTests);

const checkPermission = (feature) => {
    return async (req, res, next) => {
        try {
            // Only apply to students
            if (!req.user || req.user.role !== 'student') {
                return next();
            }

            const studentId = req.user.college_id || req.user.id;

            // 1. Check direct student blocks
            const directBlock = await Permission.findOne({
                scope: 'student',
                targetId: studentId,
                status: 'active',
                blockedFeatures: feature
            });

            if (directBlock) {
                return res.status(403).json({
                    error: 'Access Restricted',
                    message: `You have been blocked from accessing ${feature} by faculty. Reason: ${directBlock.reason}`
                });
            }

            // 2. Check Course blocks (If accessing a course-related resource)
            // Route must have :courseId param
            if (req.params.courseId) {
                const courseBlock = await Permission.findOne({
                    scope: 'course',
                    targetId: req.params.courseId,
                    // section: req.user.section, // TODO: Add section check if available
                    status: 'active',
                    blockedFeatures: feature
                });

                if (courseBlock) {
                    return res.status(403).json({
                        error: 'Access Restricted',
                        message: `Access to ${feature} in this course is restricted. Reason: ${courseBlock.reason}`
                    });
                }
            }

            next();
        } catch (error) {
            console.error('Permission check error:', error);
            // Fail safe: Allow or Block? Block is safer, but prevents use if DB error.
            res.status(500).json({ error: 'Permission check failed' });
        }
    };
};

module.exports = {
    verifySectionOwnership,
    verifyCourseAuthority,
    checkPermission
};
