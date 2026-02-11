const express = require('express');
const router = express.Router();
const adminStudentController = require('../controllers/adminStudentController');

// Get all students (paginated, searchable)
router.get('/', adminStudentController.getStudents);

// Get single student
router.get('/:id', adminStudentController.getStudent);

// Create new student
router.post('/', adminStudentController.createStudent);

// Bulk upload students via CSV
router.post('/bulk-upload', adminStudentController.bulkUpload);

// Update student
router.put('/:id', adminStudentController.updateStudent);

// Delete (deactivate) student
router.delete('/:id', adminStudentController.deleteStudent);

module.exports = router;
