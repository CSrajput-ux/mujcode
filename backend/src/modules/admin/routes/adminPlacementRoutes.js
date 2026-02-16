const express = require('express');
const router = express.Router();
const adminPlacementController = require('../controllers/adminPlacementController');
const { verifyToken, authorize } = require('../../../middlewares/authMiddleware');

// TPO / Admin
router.post('/drives', verifyToken, authorize('admin', 'tpo'), adminPlacementController.createDrive);
router.get('/companies', verifyToken, authorize('admin', 'tpo'), adminPlacementController.getCompanies);

module.exports = router;
