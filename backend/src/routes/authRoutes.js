<<<<<<< HEAD
// File: src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, changePassword, getCurrentUser, logout } = require('../controllers/authController');
const { verifyAuth } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/change-password', changePassword);

// NEW: Cookie-based auth routes
router.get('/me', verifyAuth, getCurrentUser); // Get current user from cookie
router.post('/logout', logout); // Clear cookie

module.exports = router;
=======
// File: src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, changePassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/change-password', changePassword);

module.exports = router;
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
