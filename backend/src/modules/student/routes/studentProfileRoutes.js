<<<<<<< HEAD:backend/src/modules/student/routes/studentProfileRoutes.js
// File: src/routes/studentProfileRoutes.js
const express = require('express');
const router = express.Router();
const { updateProfile, getProfile } = require('../controllers/studentProfileController');
const authMiddleware = require('../../../middlewares/authMiddleware');

router.put('/profile', authMiddleware, updateProfile); // Changed from /profile/:userId to /profile
router.get('/profile/:userId', getProfile);

module.exports = router;
=======
// File: src/routes/studentProfileRoutes.js
const express = require('express');
const router = express.Router();
const { updateProfile, getProfile } = require('../controllers/studentProfileController');
const authMiddleware = require('../middlewares/authMiddleware');

router.put('/profile', authMiddleware, updateProfile); // Changed from /profile/:userId to /profile
router.get('/profile/:userId', getProfile);

module.exports = router;
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34:backend/src/routes/studentProfileRoutes.js
