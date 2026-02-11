const express = require('express');
const router = express.Router();
const { getTests, getTestById, createTest, submitTest, getStudentSubmissions, getTestsForFaculty, getTestSubmissions } = require('../controllers/testController');

// Public/Student routes
router.get('/', getTests);
router.get('/:id', getTestById);
router.get('/submissions/:studentId', getStudentSubmissions);
router.post('/submit', submitTest);

// Faculty Routes
router.get('/faculty/all', getTestsForFaculty);
router.get('/:testId/submissions', getTestSubmissions);

// Admin/Faculty routes (should be protected in prod)
router.post('/create', createTest);

module.exports = router;
