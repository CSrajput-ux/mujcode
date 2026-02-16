const express = require('express');
const router = express.Router();
const studentPlacementController = require('../controllers/studentPlacementController');
const { verifyToken } = require('../../../middlewares/authMiddleware');

router.use(verifyToken);

// Public / Student
router.get('/drives', studentPlacementController.getPlacementDrives);
router.get('/my-applications', studentPlacementController.getMyApplications);
router.post('/apply', studentPlacementController.applyForJob);

module.exports = router;
