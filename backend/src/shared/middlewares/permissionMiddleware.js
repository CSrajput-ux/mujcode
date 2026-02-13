const Faculty = require('../models/mongo/Faculty');
const Course = require('../models/mongo/Course');

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

module.exports = {
    verifySectionOwnership,
    verifyCourseAuthority
};
