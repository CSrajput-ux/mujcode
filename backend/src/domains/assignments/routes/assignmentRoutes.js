const express = require('express');
const router = express.Router();
const controller = require('../controllers/assignmentController');

router.post('/create', controller.createAssignment);
router.get('/faculty/all', controller.getFacultyAssignments);
router.get('/:assignmentId/submissions', controller.getAssignmentSubmissions);
router.post('/submission/:submissionId/grade', controller.gradeSubmission);
router.post('/seed', controller.seedAssignments);

module.exports = router;
