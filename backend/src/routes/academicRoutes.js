// File: src/routes/academicRoutes.js
const express = require('express');
const router = express.Router();
const Branch = require('../models/mongo/Branch');
const SemesterCourse = require('../models/mongo/SemesterCourse');
const { verifyToken } = require('../middlewares/authMiddleware');

// ==================== BRANCH ROUTES ====================

/**
 * @route   GET /api/academic/branches
 * @desc    Get all active branches
 * @access  Public
 */
router.get('/branches', async (req, res) => {
    try {
        const branches = await Branch.find({ isActive: true })
            .sort({ code: 1 })
            .select('-__v');

        res.json({
            success: true,
            count: branches.length,
            data: branches
        });
    } catch (error) {
        console.error('Error fetching branches:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching branches',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/academic/branches/:branchCode
 * @desc    Get specific branch details by code
 * @access  Public
 */
router.get('/branches/:branchCode', async (req, res) => {
    try {
        const branchCode = req.params.branchCode.toUpperCase();
        const branch = await Branch.findOne({ code: branchCode, isActive: true })
            .select('-__v');

        if (!branch) {
            return res.status(404).json({
                success: false,
                message: `Branch with code ${branchCode} not found`
            });
        }

        res.json({
            success: true,
            data: branch
        });
    } catch (error) {
        console.error('Error fetching branch:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching branch',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/academic/branches/category/:category
 * @desc    Get branches by category (e.g., CSE-related, ECE-related)
 * @access  Public
 */
router.get('/branches/category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        let branchCodes = [];

        // Define category mappings
        const categoryMap = {
            'computer-science': ['CSE', 'CSE-AIML', 'CCE', 'IT', 'DSE', 'CSB', 'CSFT', 'CPS', 'MNC'],
            'electronics': ['ECE', 'VLSI', 'EIE', 'EEE', 'ECE-EC'],
            'mechanical': ['ME', 'MECH', 'AUTO'],
            'civil': ['CE'],
            'chemical': ['CHE', 'BT'],
            'others': ['IE', 'FT', 'RAI']
        };

        branchCodes = categoryMap[category] || [];

        const branches = await Branch.find({
            code: { $in: branchCodes },
            isActive: true
        }).sort({ code: 1 });

        res.json({
            success: true,
            category,
            count: branches.length,
            data: branches
        });
    } catch (error) {
        console.error('Error fetching branches by category:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching branches',
            error: error.message
        });
    }
});

// ==================== SEMESTER COURSE ROUTES ====================

/**
 * @route   GET /api/academic/courses/:branchCode/:semester
 * @desc    Get courses for a specific branch and semester
 * @access  Public
 */
router.get('/courses/:branchCode/:semester', async (req, res) => {
    try {
        const branchCode = req.params.branchCode.toUpperCase();
        const semester = parseInt(req.params.semester);

        if (isNaN(semester) || semester < 1 || semester > 8) {
            return res.status(400).json({
                success: false,
                message: 'Invalid semester. Must be between 1 and 8'
            });
        }

        // Find courses for this semester and branch
        // Include courses with branches=['ALL'] or branches containing the specific branch code
        const courses = await SemesterCourse.find({
            semester: semester,
            isActive: true,
            $or: [
                { branches: 'ALL' },
                { branches: branchCode }
            ]
        }).sort({ courseCode: 1 }).select('-__v');

        res.json({
            success: true,
            branchCode,
            semester,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching courses',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/academic/courses/:branchCode
 * @desc    Get all courses for a specific branch (all semesters)
 * @access  Public
 */
router.get('/courses/:branchCode', async (req, res) => {
    try {
        const branchCode = req.params.branchCode.toUpperCase();

        // Find all courses for this branch
        const courses = await SemesterCourse.find({
            isActive: true,
            $or: [
                { branches: 'ALL' },
                { branches: branchCode }
            ]
        }).sort({ semester: 1, courseCode: 1 }).select('-__v');

        // Group by semester
        const coursesBySemester = {};
        courses.forEach(course => {
            if (!coursesBySemester[course.semester]) {
                coursesBySemester[course.semester] = [];
            }
            coursesBySemester[course.semester].push(course);
        });

        res.json({
            success: true,
            branchCode,
            totalCourses: courses.length,
            data: coursesBySemester
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching courses',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/academic/courses/code/:courseCode
 * @desc    Get specific course by course code
 * @access  Public
 */
router.get('/courses/code/:courseCode', async (req, res) => {
    try {
        const courseCode = req.params.courseCode.toUpperCase();
        const course = await SemesterCourse.findOne({
            courseCode: courseCode,
            isActive: true
        }).select('-__v');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: `Course with code ${courseCode} not found`
            });
        }

        res.json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching course',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/academic/roadmap/:branchCode
 * @desc    Get complete academic roadmap for a branch (with credit summary)
 * @access  Public
 */
router.get('/roadmap/:branchCode', async (req, res) => {
    try {
        const branchCode = req.params.branchCode.toUpperCase();

        // Verify branch exists
        const branch = await Branch.findOne({ code: branchCode, isActive: true });
        if (!branch) {
            return res.status(404).json({
                success: false,
                message: `Branch ${branchCode} not found`
            });
        }

        // Get all courses for this branch
        const courses = await SemesterCourse.find({
            isActive: true,
            $or: [
                { branches: 'ALL' },
                { branches: branchCode }
            ]
        }).sort({ semester: 1, courseCode: 1 });

        // Create roadmap with semester-wise breakdown
        const roadmap = [];
        for (let sem = 1; sem <= branch.duration; sem++) {
            const semCourses = courses.filter(c => c.semester === sem);
            const semCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);

            roadmap.push({
                semester: sem,
                totalCredits: semCredits,
                courseCount: semCourses.length,
                courses: semCourses.map(c => ({
                    courseCode: c.courseCode,
                    courseName: c.courseName,
                    credits: c.credits,
                    courseType: c.courseType,
                    isElective: c.isElective
                }))
            });
        }

        const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

        res.json({
            success: true,
            branch: {
                code: branch.code,
                name: branch.name,
                totalSemesters: branch.duration
            },
            totalCredits,
            roadmap
        });
    } catch (error) {
        console.error('Error generating roadmap:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating academic roadmap',
            error: error.message
        });
    }
});

// ==================== PERSONALIZED ROUTES (AUTHENTICATED) ====================

/**
 * @route   GET /api/academic/my-courses
 * @desc    Get courses for authenticated student based on their profile (branch + semester)
 * @access  Private (Student)
 */
router.get('/my-courses', verifyToken, async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please login first.'
            });
        }

        // Import StudentProfile model
        const StudentProfile = require('../models/pg/StudentProfile');

        // Get student profile
        const studentProfile = await StudentProfile.findOne({
            where: { userId: req.user.id }
        });

        if (!studentProfile) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found. Please complete your profile first.',
                hint: 'Update your branch and semester in your profile settings'
            });
        }

        // Check if branch and semester are set
        if (!studentProfile.branch || !studentProfile.semester) {
            return res.status(400).json({
                success: false,
                message: 'Branch and semester not set in your profile',
                hint: 'Please update your profile with branch and semester information',
                profile: {
                    branch: studentProfile.branch || null,
                    semester: studentProfile.semester || null
                }
            });
        }

        const branchCode = studentProfile.branch.toUpperCase();
        const semester = studentProfile.semester;

        // Fetch courses for student's branch and semester
        const courses = await SemesterCourse.find({
            semester: semester,
            isActive: true,
            $or: [
                { branches: 'ALL' },
                { branches: branchCode }
            ]
        }).sort({ courseCode: 1 }).select('-__v');

        // Calculate credits summary
        const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
        const theoryCourses = courses.filter(c => c.courseType === 'Theory');
        const labCourses = courses.filter(c => c.courseType === 'Lab');
        const projectCourses = courses.filter(c => c.courseType === 'Project');

        res.json({
            success: true,
            student: {
                name: req.user.name,
                email: req.user.email,
                branch: branchCode,
                semester: semester,
                section: studentProfile.section || null
            },
            summary: {
                totalCourses: courses.length,
                totalCredits: totalCredits,
                breakdown: {
                    theory: theoryCourses.length,
                    lab: labCourses.length,
                    project: projectCourses.length
                }
            },
            courses: courses.map(c => ({
                courseCode: c.courseCode,
                courseName: c.courseName,
                credits: c.credits,
                courseType: c.courseType,
                isElective: c.isElective || false,
                electiveCategory: c.electiveCategory || null,
                prerequisites: c.prerequisites || [],
                syllabusOverview: c.syllabusOverview || null
            }))
        });
    } catch (error) {
        console.error('Error fetching student courses:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching your courses',
            error: error.message
        });
    }
});

module.exports = router;
