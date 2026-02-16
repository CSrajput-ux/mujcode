const express = require('express');
const router = express.Router();
const {
    createTheoryQuestion,
    getTheoryQuestions,
    getTheoryQuestionById,
    updateTheoryQuestion,
    deleteTheoryQuestion,
    getTheoryQuestionsForStudent
} = require('../controllers/theoryController');

// Faculty routes - Full access
router.post('/tests/:testId/questions/theory', createTheoryQuestion);
router.get('/tests/:testId/questions/theory', getTheoryQuestions);
router.get('/questions/theory/:questionId', getTheoryQuestionById);
router.put('/questions/theory/:questionId', updateTheoryQuestion);
router.delete('/questions/theory/:questionId', deleteTheoryQuestion);

// Student routes - Limited access (hides model answers)
router.get('/tests/:testId/questions/theory/student', getTheoryQuestionsForStudent);

module.exports = router;
