const express = require('express');
const router = express.Router();
const adminFacultyController = require('../controllers/adminFacultyController');

// Get all faculty (paginated, searchable)
router.get('/', adminFacultyController.getFaculty);

// Get single faculty
router.get('/:id', adminFacultyController.getFacultySingle);

// Create new faculty
router.post('/', adminFacultyController.createFaculty);

// Assign courses to faculty
router.post('/assign-courses', adminFacultyController.assignCourses);

// Update faculty
router.put('/:id', adminFacultyController.updateFaculty);

// Delete (deactivate) faculty
router.delete('/:id', adminFacultyController.deleteFaculty);

module.exports = router;
