// File: src/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const { getCourses, getStudentCourses, enrollCourse, getCourseDetails } = require('../controllers/courseController');

router.get('/courses', getCourses);
router.get('/courses/:studentId', getStudentCourses);
router.get('/course/:courseId/details', getCourseDetails); // New route for course details with problems
router.post('/courses/enroll', enrollCourse);

module.exports = router;

