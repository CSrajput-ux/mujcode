const Test = require('../models/mongo/Test');
const Question = require('../models/mongo/Question');
const TestSubmission = require('../models/mongo/TestSubmission');

// Get all tests (with optional filters)
exports.getTests = async (req, res) => {
    try {
        const { type, status } = req.query;
        let query = {};
        if (type) query.type = type;
        if (status) query.status = status;

        // CRITICAL: Students should ONLY see published tests
        query.isPublished = true;

        const tests = await Test.find(query).sort({ startTime: 1 });
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tests', error: error.message });
    }
};

// Get a single test by ID
exports.getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id).populate('questions');
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // TODO: For students taking the test, we should sanitize questions to remove correctOption
        // For now, sending full data. In production, create a sanitization function.
        // const sanitizedQuestions = test.questions.map(q => {
        //     const { correctOption, ...rest } = q.toObject();
        //     return rest;
        // });

        res.json(test);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching test details', error: error.message });
    }
};

// Create a new test (Admin/Faculty only - for seeding/testing)
exports.createTest = async (req, res) => {
    try {
        const { title, type, testType, duration, questions: questionData, startTime, isPublished } = req.body;

        // For new test builder flow - create empty test
        if (testType) {
            const newTest = new Test({
                title,
                type,
                testType,
                duration,
                startTime,
                status: 'Draft', // Start as draft
                builderStatus: 'building', // Builder is in progress
                isPublished: isPublished || false // Default to false
            });

            await newTest.save();

            return res.status(201).json({
                testId: newTest._id,
                message: 'Test created successfully',
                redirectUrl: `/faculty/tests/${newTest._id}/builder`
            });
        }

        // Legacy flow - with questions
        const createdQuestions = await Question.insertMany(questionData);
        const questionIds = createdQuestions.map(q => q._id);

        const newTest = new Test({
            title,
            type,
            duration,
            startTime,
            questions: questionIds,
            status: 'Upcoming', // Default
            isPublished: isPublished || false // Default to false if not provided
        });

        await newTest.save();
        res.status(201).json(newTest);
    } catch (error) {
        res.status(500).json({ message: 'Error creating test', error: error.message });
    }
};

// Submit a test
exports.submitTest = async (req, res) => {
    try {
        const { testId, studentId, answers, warningsIssued } = req.body;

        const test = await Test.findById(testId).populate('questions');
        if (!test) return res.status(404).json({ message: 'Test not found' });

        let score = 0;
        let totalMaxScore = 0;

        // Calculate Score
        test.questions.forEach(question => {
            totalMaxScore += question.marks;
            const studentAnswer = answers.find(a => a.questionId.toString() === question._id.toString());

            if (studentAnswer && studentAnswer.selectedOption === question.correctOption) {
                score += question.marks;
            }
        });

        // Save Submission
        const submission = new TestSubmission({
            testId,
            studentId, // Ensure this comes from auth in real app
            answers,
            score,
            totalMaxScore,
            status: 'Submitted',
            submitTime: new Date(),
            warningsIssued
        });

        await submission.save();

        // Log Activity
        const activityService = require('../services/activityService');
        await activityService.logActivity(studentId);

        res.json({
            message: 'Test submitted successfully',
            score,
            totalMaxScore,
            submissionId: submission._id
        });

    } catch (error) {
        res.status(500).json({ message: 'Error submitting test', error: error.message });
    }
};

// Get submissions for a student
exports.getStudentSubmissions = async (req, res) => {
    try {
        const { studentId } = req.params;
        const submissions = await TestSubmission.find({ studentId })
            .populate('testId', 'title type')
            .sort({ submitTime: -1 });

        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submissions', error: error.message });
    }
};

// --- FACULTY APIs ---

// Get all tests for faculty view (with submission counts)
exports.getTestsForFaculty = async (req, res) => {
    try {
        // In real app, filter by course/facultyId
        const tests = await Test.find().sort({ startTime: -1 });

        // Enhance with aggregation for stats (mock logic for now or simple count)
        const enhancedTests = await Promise.all(tests.map(async (test) => {
            const submissionCount = await TestSubmission.countDocuments({ testId: test._id });
            // Calculate average score
            const stats = await TestSubmission.aggregate([
                { $match: { testId: test._id } },
                { $group: { _id: null, avgScore: { $avg: "$score" } } }
            ]);

            return {
                ...test.toObject(),
                totalAppeared: submissionCount,
                avgScore: stats[0]?.avgScore || 0
            };
        }));

        res.json(enhancedTests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching faculty tests', error: error.message });
    }
};

// Get all submissions for a specific test (for detailed table)
exports.getTestSubmissions = async (req, res) => {
    try {
        const { testId } = req.params;
        const { section, branch } = req.query; // Filters

        let query = { testId };

        // If we had Student Profile linked, we would filter here.
        // For now, fetching all and optionally filtering in memory or via simple aggregation if possible.
        // Assuming simple fetch for MVP.

        const submissions = await TestSubmission.find(query)
            .sort({ score: -1 }); // Default sort by score

        // Mocking student details join (since we don't have full relational User populated yet in Mongo for all)
        // In production: .populate('studentId') if studentId matches User._id or similar.

        const enhancedSubmissions = submissions.map(sub => ({
            ...sub.toObject(),
            studentName: "Student " + sub.studentId, // Placeholder if name not available
            rollNumber: sub.studentId,
            section: "A", // Placeholder
            status: sub.score >= 5 ? 'Pass' : 'Fail' // Mock pass logic
        }));

        res.json(enhancedSubmissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching test submissions', error: error.message });
    }
};

// Toggle publish status for a test (Faculty only)
exports.togglePublishTest = async (req, res) => {
    try {
        const { testId } = req.params;
        const test = await Test.findById(testId);

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Toggle the publish status
        test.isPublished = !test.isPublished;
        await test.save();

        res.json({
            message: `Test ${test.isPublished ? 'published' : 'unpublished'} successfully`,
            test
        });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling publish status', error: error.message });
    }
};
