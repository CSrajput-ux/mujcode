const express = require('express');
const router = express.Router();
const { getTests, getTestById, createTest, submitTest, getStudentSubmissions, getTestsForFaculty, getTestSubmissions, togglePublishTest, deleteTest } = require('../controllers/testController');

const { verifyToken } = require('../middlewares/authMiddleware');

// Public/Student routes
router.get('/', verifyToken, getTests);
router.get('/:id', getTestById);
router.get('/submissions/:studentId', getStudentSubmissions);
router.post('/submit', submitTest);

// Faculty Routes
router.get('/faculty/all', getTestsForFaculty);
router.get('/:testId/submissions', getTestSubmissions);

// Admin/Faculty routes (should be protected in prod)
router.post('/create', createTest);

// Toggle publish status (Faculty only)
router.patch('/:testId/publish', togglePublishTest);

// Delete a test (Faculty only)
router.delete('/:testId', deleteTest);

module.exports = router;
