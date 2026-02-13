const express = require('express');
const router = express.Router();
const {
    createCodingQuestion,
    getCodingQuestions,
    getCodingQuestionById,
    updateCodingQuestion,
    deleteCodingQuestion,
    getCodingQuestionsForStudent
} = require('../controllers/codingController');

// Faculty routes - Full access
router.post('/tests/:testId/questions/coding', createCodingQuestion);
router.get('/tests/:testId/questions/coding', getCodingQuestions);
router.get('/questions/coding/:questionId', getCodingQuestionById);
router.put('/questions/coding/:questionId', updateCodingQuestion);
router.delete('/questions/coding/:questionId', deleteCodingQuestion);

// Student routes - Limited access (hides test cases)
router.get('/tests/:testId/questions/coding/student', getCodingQuestionsForStudent);

module.exports = router;
