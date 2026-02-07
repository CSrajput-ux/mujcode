// File: src/routes/problemRoutes.js
const express = require('express');
const router = express.Router();
const { getProblems, getProblemById, getProblemByNumber, getMetadata, getProblemStats } = require('../controllers/problemController');
const { cache } = require('../middlewares/cacheMiddleware');

// Cache lists for 1 hour, individual problems for 24 hours
router.get('/problems/stats', cache(300), getProblemStats); // Cache stats for 5 mins
router.get('/problems', cache(3600), getProblems);
router.get('/problems/metadata', cache(3600), getMetadata);
router.get('/problems/:id', cache(86400), getProblemById);
router.get('/problems/number/:number', cache(86400), getProblemByNumber);

module.exports = router;
