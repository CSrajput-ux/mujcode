// File: src/routes/problemRoutes.js
const express = require('express');
const router = express.Router();
const { getProblems, getProblemById, getProblemByNumber, getMetadata } = require('../controllers/problemController');

router.get('/problems', getProblems);
router.get('/problems/metadata', getMetadata);
router.get('/problems/:id', getProblemById);
router.get('/problems/number/:number', getProblemByNumber);

module.exports = router;
