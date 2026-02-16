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

        // Get problems for this courseId (using our new courseId field)
        const Problem = require('../models/mongo/Problem');
        const Submission = require('../models/mongo/Submission');

        const problems = await Problem.find({ courseId: courseId }).sort({ number: 1 });
        console.log(`Found ${problems.length} problems for course: ${course.title}`);

        // Get user's solved problems if studentId provided
        let solvedProblemIds = [];
        if (studentId) {
            const acceptedSubmissions = await Submission.find({
                userId: parseInt(studentId),
                verdict: 'Accepted'
            }).select('problemId');

            solvedProblemIds = acceptedSubmissions.map(sub => sub.problemId);
            console.log(`Student ${studentId} has solved: ${solvedProblemIds.length} problems`);
        }

        // Map problems with solved status
        const problemsWithStatus = problems.map(problem => ({
            _id: problem._id,
            number: problem.number,
            title: problem.title,
            difficulty: problem.difficulty,
            category: problem.category,
            topic: problem.topic,
            points: problem.points,
            status: solvedProblemIds.includes(problem.number.toString()) ? 'solved' : 'todo'
        }));

        // Get user's enrollment status
        let enrollmentInfo = null;
        if (studentId) {
            const UserCourse = require('../models/mongo/UserCourse');
            enrollmentInfo = await UserCourse.findOne({
                userId: parseInt(studentId),
                courseId: courseId
            });
        }

        res.status(200).json({
            course: {
                _id: course._id,
                title: course.title,
                description: course.description,
                category: course.category,
                difficulty: course.difficulty,
                totalProblems: course.totalProblems,
                icon: course.icon,
                enrolled: !!enrollmentInfo,
                progress: enrollmentInfo?.progress || 0,
                problemsSolved: enrollmentInfo?.problemsSolved || 0
            },
            problems: problemsWithStatus,
            totalProblems: problemsWithStatus.length,
            solvedCount: problemsWithStatus.filter(p => p.status === 'solved').length
        });
    } catch (error) {
        console.error('Error in getCourseDetails:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;

