const express = require('express');
const router = express.Router();
const judgeController = require('../controllers/judgeController');

// Submit code for judging
router.post('/submit', judgeController.submitCode);

// Get submission status
router.get('/status/:submissionId', judgeController.getSubmissionStatus);

// Get user submissions for a specific problem
router.get('/submissions/:userId/:problemId', judgeController.getUserSubmissions);

module.exports = router;
