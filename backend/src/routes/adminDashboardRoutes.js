const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');

// Dashboard statistics
router.get('/stats', adminDashboardController.getDashboardStats);

// Entity listing endpoints
router.get('/students', adminDashboardController.getStudents);
router.get('/faculty', adminDashboardController.getFaculty);
router.get('/companies', adminDashboardController.getCompanies);
router.get('/placements', adminDashboardController.getPlacements);

// Company CRUD
router.post('/companies', adminDashboardController.createCompany);
router.put('/companies/:id', adminDashboardController.updateCompany);

// Placement CRUD
router.post('/placements', adminDashboardController.createPlacement);
router.put('/placements/:id', adminDashboardController.updatePlacement);

module.exports = router;
