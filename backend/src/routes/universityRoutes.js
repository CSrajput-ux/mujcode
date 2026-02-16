<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Public or Authenticated? 
// Generally, structure data can be public for dropdowns, but let's keep it safe or open.
// For now, let's open it to authenticated users.

router.get('/faculties', verifyToken, universityController.getFaculties);
router.get('/departments', verifyToken, universityController.getDepartments);
router.get('/programs', verifyToken, universityController.getPrograms);
router.get('/branches', verifyToken, universityController.getBranches);
router.get('/sections', verifyToken, universityController.getSections);
router.get('/academic-years', verifyToken, universityController.getAcademicYears);
router.get('/subjects', verifyToken, universityController.getSubjects);


module.exports = router;
=======
const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Public or Authenticated? 
// Generally, structure data can be public for dropdowns, but let's keep it safe or open.
// For now, let's open it to authenticated users.

router.get('/faculties', verifyToken, universityController.getFaculties);
router.get('/departments', verifyToken, universityController.getDepartments);
router.get('/programs', verifyToken, universityController.getPrograms);
router.get('/branches', verifyToken, universityController.getBranches);
router.get('/sections', verifyToken, universityController.getSections);
router.get('/academic-years', verifyToken, universityController.getAcademicYears);
router.get('/subjects', verifyToken, universityController.getSubjects);


module.exports = router;
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
