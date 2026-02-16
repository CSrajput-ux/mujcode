<<<<<<< HEAD:backend/src/modules/faculty/routes/facultyRoutes.js
// File: src/routes/facultyRoutes.js
const express = require('express');
const router = express.Router();
const { updateFacultyProfile, getTeachingMap, getFacultyProfile } = require('../controllers/facultyController');
const authMiddleware = require('../../../middlewares/authMiddleware');

// Get profile
router.get('/profile/:userId', getFacultyProfile);

// Update profile (Faculty only)
router.put('/profile/:facultyId', authMiddleware, updateFacultyProfile);

// Get teaching map for students (Public/Student)
router.get('/teaching-map', getTeachingMap);

module.exports = router;
=======
// File: src/routes/facultyRoutes.js
const express = require('express');
const router = express.Router();
const { updateFacultyProfile, getTeachingMap, getFacultyProfile } = require('../controllers/facultyController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get profile
router.get('/profile/:userId', getFacultyProfile);

// Update profile (Faculty only)
router.put('/profile/:facultyId', authMiddleware, updateFacultyProfile);

// Get teaching map for students (Public/Student)
router.get('/teaching-map', getTeachingMap);

module.exports = router;
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34:backend/src/routes/facultyRoutes.js
