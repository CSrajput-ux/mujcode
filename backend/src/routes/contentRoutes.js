const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Public routes (none for now, all protected)

// Protected routes
router.use(protect);

// Upload: Only Faculty
router.post('/upload', authorize('faculty', 'admin'), upload.single('file'), contentController.uploadContent);

// Get: Students and Faculty
router.get('/', contentController.getContent);

// Delete: Only Faculty (Owner) or Admin
router.delete('/:id', authorize('faculty', 'admin'), contentController.deleteContent);

module.exports = router;
