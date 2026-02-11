const express = require('express');
const router = express.Router();
const {
    createMCQQuestion,
    getMCQQuestions,
    getMCQQuestionById,
    updateMCQQuestion,
    deleteMCQQuestion,
    getMCQQuestionsForStudent
} = require('../controllers/mcqController');

// Faculty routes - Full access
router.post('/tests/:testId/questions/mcq', createMCQQuestion);
router.get('/tests/:testId/questions/mcq', getMCQQuestions);
router.get('/questions/mcq/:questionId', getMCQQuestionById);
router.put('/questions/mcq/:questionId', updateMCQQuestion);
router.delete('/questions/mcq/:questionId', deleteMCQQuestion);

// Student routes - Limited access (hides correct answers)
router.get('/tests/:testId/questions/mcq/student', getMCQQuestionsForStudent);

module.exports = router;
