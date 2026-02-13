const MockTest = require('../models/mongo/MockTest');
const MockQuestion = require('../models/mongo/MockQuestion');
const MockAttempt = require('../models/mongo/MockAttempt');

/**
 * GET /api/mock-tests
 * Fetch all active mock tests with optional filters
 */
exports.getMockTests = async (req, res) => {
    try {
        const { difficulty, category, search } = req.query;

        const filter = { isActive: true };

        // Add difficulty filter
        if (difficulty && difficulty !== 'All') {
            filter.difficulty = difficulty;
        }

        // Add category filter
        if (category) {
            filter.category = category;
        }

        // Add text search
        if (search) {
            filter.$text = { $search: search };
        }

        const mockTests = await MockTest.find(filter)
            .sort({ createdAt: -1 })
            .lean();

        res.json({ mockTests });
    } catch (error) {
        console.error('Error fetching mock tests:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * GET /api/mock-tests/:id
 * Get mock test details with student's attempt info
 */
exports.getMockTestById = async (req, res) => {
    try {
        const mockTest = await MockTest.findById(req.params.id).lean();

        if (!mockTest) {
            return res.status(404).json({ error: 'Mock test not found' });
        }

        const { studentId } = req.query;

        if (!studentId) {
            return res.json({ mockTest, studentAttempts: 0, canAttempt: true, lastAttempt: null });
        }

        // Get student's completed attempts
        const attempts = await MockAttempt.find({
            mockTestId: req.params.id,
            studentId,
            status: 'submitted'
        })
            .sort({ attemptNumber: -1 })
            .lean();

        const studentAttempts = attempts.length;
        const canAttempt = mockTest.attemptsAllowed === -1 ||
            studentAttempts < mockTest.attemptsAllowed;
        const lastAttempt = attempts[0] || null;

        res.json({
            mockTest,
            studentAttempts,
            canAttempt,
            lastAttempt
        });
    } catch (error) {
        console.error('Error fetching mock test by ID:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * POST /api/mock-tests/:id/start
 * Start a new mock test attempt with randomized questions
 */
exports.startMockTest = async (req, res) => {
    try {
        const { studentId } = req.body;

        if (!studentId) {
            return res.status(400).json({ error: 'Student ID is required' });
        }

        const mockTest = await MockTest.findById(req.params.id);

        if (!mockTest) {
            return res.status(404).json({ error: 'Mock test not found' });
        }

        if (!mockTest.isActive) {
            return res.status(403).json({ error: 'This mock test is currently inactive' });
        }

        // Check if student has attempts remaining
        const previousAttempts = await MockAttempt.countDocuments({
            mockTestId: req.params.id,
            studentId,
            status: 'submitted'
        });

        if (mockTest.attemptsAllowed !== -1 && previousAttempts >= mockTest.attemptsAllowed) {
            return res.status(403).json({
                error: 'You have exhausted all attempts for this mock test'
            });
        }

        // Get all questions for this mock test
        const allQuestions = await MockQuestion.find({
            mockTestId: req.params.id
        }).lean();

        if (allQuestions.length === 0) {
            return res.status(400).json({ error: 'No questions available for this mock test' });
        }

        // Randomize and select subset
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, Math.min(mockTest.questionsPerAttempt, allQuestions.length));

        // Calculate max score
        const maxScore = selectedQuestions.reduce((sum, q) => sum + q.points, 0);

        // Create new attempt
        const attempt = new MockAttempt({
            mockTestId: req.params.id,
            studentId,
            attemptNumber: previousAttempts + 1,
            questions: selectedQuestions.map(q => q._id),
            maxScore
        });

        await attempt.save();

        // Return questions without correct answers and explanations
        const questionsForStudent = selectedQuestions.map(q => ({
            _id: q._id,
            questionText: q.questionText,
            options: q.options,
            points: q.points
        }));

        res.json({
            attemptId: attempt._id,
            questions: questionsForStudent,
            duration: mockTest.duration,
            startedAt: attempt.startedAt,
            attemptNumber: attempt.attemptNumber
        });
    } catch (error) {
        console.error('Error starting mock test:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * POST /api/mock-tests/:id/submit
 * Submit mock test attempt and calculate score
 */
exports.submitMockTest = async (req, res) => {
    try {
        const { attemptId, studentId, answers, timeTaken } = req.body;

        if (!attemptId || !studentId || !answers) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const attempt = await MockAttempt.findById(attemptId);

        if (!attempt) {
            return res.status(404).json({ error: 'Attempt not found' });
        }

        if (attempt.status === 'submitted') {
            return res.status(400).json({ error: 'This attempt has already been submitted' });
        }

        if (attempt.studentId !== studentId) {
            return res.status(403).json({ error: 'Unauthorized: Student ID mismatch' });
        }

        // Fetch all questions with correct answers
        const questions = await MockQuestion.find({
            _id: { $in: attempt.questions }
        }).lean();

        // Create question map for quick lookup
        const questionMap = {};
        questions.forEach(q => {
            questionMap[q._id.toString()] = q;
        });

        // Calculate score and process answers
        let score = 0;
        const processedAnswers = answers.map(ans => {
            const question = questionMap[ans.questionId];

            if (!question) {
                return {
                    questionId: ans.questionId,
                    selectedOption: ans.selectedOption,
                    isCorrect: false,
                    markedForReview: ans.markedForReview || false
                };
            }

            const isCorrect = question.correctOption === ans.selectedOption;
            if (isCorrect) {
                score += question.points;
            }

            return {
                questionId: ans.questionId,
                selectedOption: ans.selectedOption,
                isCorrect,
                markedForReview: ans.markedForReview || false
            };
        });

        const percentage = (score / attempt.maxScore) * 100;

        // Update attempt
        attempt.answers = processedAnswers;
        attempt.score = score;
        attempt.percentage = Math.round(percentage * 100) / 100; // Round to 2 decimals
        attempt.timeTaken = timeTaken || 0;
        attempt.submittedAt = new Date();
        attempt.status = 'submitted';
        await attempt.save();

        // Get mock test for passing percentage
        const mockTest = await MockTest.findById(attempt.mockTestId).lean();
        const passed = percentage >= mockTest.passingPercentage;

        // Prepare detailed results with explanations
        const results = questions.map(q => {
            const userAnswer = answers.find(a => a.questionId === q._id.toString());
            const selectedOption = userAnswer ? userAnswer.selectedOption : null;

            return {
                questionId: q._id,
                questionText: q.questionText,
                options: q.options,
                selectedOption,
                correctOption: q.correctOption,
                isCorrect: selectedOption === q.correctOption,
                explanation: q.explanation || 'No explanation available',
                points: q.points,
                earnedPoints: selectedOption === q.correctOption ? q.points : 0
            };
        });

        res.json({
            attemptId: attempt._id,
            score,
            maxScore: attempt.maxScore,
            percentage: attempt.percentage,
            passed,
            timeTaken: attempt.timeTaken,
            results
        });
    } catch (error) {
        console.error('Error submitting mock test:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * GET /api/mock-tests/:id/attempts
 * Get student's attempt history for a mock test
 */
exports.getMockTestAttempts = async (req, res) => {
    try {
        const { studentId } = req.query;

        if (!studentId) {
            return res.status(400).json({ error: 'Student ID is required' });
        }

        const attempts = await MockAttempt.find({
            mockTestId: req.params.id,
            studentId,
            status: 'submitted'
        })
            .sort({ attemptNumber: -1 })
            .select('attemptNumber score maxScore percentage timeTaken submittedAt')
            .lean();

        res.json({ attempts });
    } catch (error) {
        console.error('Error fetching mock test attempts:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
