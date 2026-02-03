// File: src/controllers/courseController.js
const Course = require('../models/mongo/Course');
const UserCourse = require('../models/mongo/UserCourse');

// Get all courses (with optional category filter)
exports.getCourses = async (req, res) => {
    try {
        const { category } = req.query;

        const filter = {};
        if (category && category !== 'All') {
            filter.category = category;
        }

        const courses = await Course.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ courses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get student's enrolled courses with progress
exports.getStudentCourses = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { category } = req.query;

        console.log('Fetching courses for student:', studentId);

        // Get all courses
        const courseFilter = {};
        if (category && category !== 'All') {
            courseFilter.category = category;
        }
        const allCourses = await Course.find(courseFilter);
        console.log('Found courses:', allCourses.length);

        // Get user's course progress
        const userCourses = await UserCourse.find({ userId: studentId }).populate('courseId');
        console.log('User enrolled in:', userCourses.length, 'courses');

        // Map progress to courses
        const coursesWithProgress = allCourses.map(course => {
            const userCourse = userCourses.find(uc => uc.courseId?._id.toString() === course._id.toString());

            return {
                _id: course._id,
                title: course.title,
                description: course.description,
                category: course.category,
                difficulty: course.difficulty,
                totalProblems: course.totalProblems,
                icon: course.icon,
                progress: userCourse?.progress || 0,
                problemsSolved: userCourse?.problemsSolved || 0,
                status: userCourse?.status || 'not-started',
                enrolled: !!userCourse
            };
        });

        console.log('Sending courses:', coursesWithProgress.length);
        res.status(200).json({ courses: coursesWithProgress });
    } catch (error) {
        console.error('Error in getStudentCourses:', error);
        res.status(500).json({ error: error.message });
    }
};

// Enroll in a course
exports.enrollCourse = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        // Check if already enrolled
        const existing = await UserCourse.findOne({ userId: studentId, courseId });
        if (existing) {
            return res.status(400).json({ error: 'Already enrolled in this course' });
        }

        const userCourse = new UserCourse({
            userId: studentId,
            courseId,
            enrolledAt: new Date(),
            status: 'ongoing'
        });

        await userCourse.save();
        res.status(201).json({ message: 'Enrolled successfully', userCourse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Map course category to problem category
const categoryToProblemsMapping = {
    'C': 'C Programming',
    'C++': 'Algorithms',
    'Java': 'Algorithms',
    'Python': 'Python',
    'JavaScript': 'JavaScript',
    'SQL': 'Database',
    'DSA': 'Data Structures',
    'Interview': 'Algorithms',
    'Web Development': 'Web Development',
    'OOP': 'OOPs',
    'OS': 'Operating Systems',
    'Networks': 'Computer Networks'
};

// Get course details with problems
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { studentId } = req.query;

        console.log('Fetching course details for:', courseId);

        // Get course details
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Map course category to problem category
        const problemCategory = categoryToProblemsMapping[course.category] || course.category;
        console.log('Looking for problems with category:', problemCategory);

        // Get problems for this course category
        const Problem = require('../models/mongo/Problem');
        const problems = await Problem.find({ category: problemCategory }).sort({ number: 1 });
        console.log('Found problems:', problems.length);

        // Get user's solved problems if studentId provided
        let solvedProblems = [];
        if (studentId) {
            const StudentProgress = require('../models/mongo/StudentProgress');
            const progress = await StudentProgress.findOne({ userId: studentId });
            solvedProblems = progress?.solvedProblemIds || [];
        }

        // Map problems with solved status
        const problemsWithStatus = problems.map(problem => ({
            _id: problem._id,
            number: problem.number,
            title: problem.title,
            difficulty: problem.difficulty,
            category: problem.category,
            points: problem.points,
            solved: solvedProblems.includes(problem.number)
        }));

        res.status(200).json({
            course: {
                _id: course._id,
                title: course.title,
                description: course.description,
                category: course.category,
                difficulty: course.difficulty,
                totalProblems: course.totalProblems,
                icon: course.icon
            },
            problems: problemsWithStatus,
            totalProblems: problemsWithStatus.length,
            solvedCount: problemsWithStatus.filter(p => p.solved).length
        });
    } catch (error) {
        console.error('Error in getCourseDetails:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;

