const express = require('express');
const router = express.Router();
const controller = require('../controllers/mockTestController');

// Get all active mock tests (with optional filters)
router.get('/', controller.getMockTests);

// Get mock test details with student's attempt info
router.get('/:id', controller.getMockTestById);

// Start a new mock test attempt
router.post('/:id/start', controller.startMockTest);

// Submit mock test attempt
router.post('/:id/submit', controller.submitMockTest);

// Get student's attempt history for a mock test
router.get('/:id/attempts', controller.getMockTestAttempts);

module.exports = router;
