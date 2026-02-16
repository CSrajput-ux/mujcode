const express = require('express');
const router = express.Router();
const placementController = require('../controllers/placementController');
const { verifyToken, authorize } = require('../middlewares/authMiddleware');

// Public / Student
router.get('/drives', verifyToken, placementController.getPlacementDrives);
router.get('/my-applications', verifyToken, placementController.getMyApplications);
router.post('/apply', verifyToken, placementController.applyForJob);

// TPO / Admin
router.post('/drives', verifyToken, authorize('admin', 'tpo'), placementController.createDrive);
router.get('/companies', verifyToken, authorize('admin', 'tpo'), placementController.getCompanies);


module.exports = router;
