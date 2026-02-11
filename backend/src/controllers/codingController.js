const CodingQuestion = require('../models/mongo/CodingQuestion');
const Test = require('../models/mongo/Test');

// Create a new coding question for a test
exports.createCodingQuestion = async (req, res) => {
    try {
        const { testId } = req.params;
        const {
            title,
            problemStatement,
            difficulty,
            allowedLanguages,
            starterCode,
            testCases,
            timeLimit,
            memoryLimit,
            order
        } = req.body;

        // Verify test exists and is of Coding type
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        if (test.testType !== 'Coding') {
            return res.status(400).json({ message: 'This test is not a Coding test' });
        }

        // Create coding question
        const codingQuestion = new CodingQuestion({
            testId,
            title,
            problemStatement,
            difficulty,
            allowedLanguages,
            starterCode,
            testCases,
            timeLimit,
            memoryLimit,
            order: order || test.codingQuestions.length
        });

        await codingQuestion.save();

        // Add question reference to test
        test.codingQuestions.push(codingQuestion._id);
        await test.save();

        res.status(201).json({
            message: 'Coding question created successfully',
            questionId: codingQuestion._id,
            question: codingQuestion
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating coding question', error: error.message });
    }
};

// Get all coding questions for a test
exports.getCodingQuestions = async (req, res) => {
    try {
        const { testId } = req.params;
        const questions = await CodingQuestion.find({ testId }).sort({ order: 1 });

        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching coding questions', error: error.message });
    }
};

// Get single coding question by ID
exports.getCodingQuestionById = async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await CodingQuestion.findById(questionId);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json(question);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching question', error: error.message });
    }
};

// Update coding question
exports.updateCodingQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const updateData = req.body;

        const question = await CodingQuestion.findByIdAndUpdate(
            questionId,
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({
            message: 'Question updated successfully',
            question
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating question', error: error.message });
    }
};

// Delete coding question
exports.deleteCodingQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        const question = await CodingQuestion.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Remove from test's question array
        await Test.findByIdAndUpdate(
            question.testId,
            { $pull: { codingQuestions: questionId } }
        );

        await CodingQuestion.findByIdAndDelete(questionId);

        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting question', error: error.message });
    }
};

// Get coding questions for students (hides test case details)
exports.getCodingQuestionsForStudent = async (req, res) => {
    try {
        const { testId } = req.params;
        const { showSolutions } = req.query; // Set to true after test completion

        const questions = await CodingQuestion.find({ testId }).sort({ order: 1 });

        // If test is not completed, hide test case expected outputs
        if (showSolutions !== 'true') {
            const sanitizedQuestions = questions.map(q => {
                const questionObj = q.toObject();
                // Hide expected outputs from students during test
                questionObj.testCases = questionObj.testCases.map(tc => ({
                    input: tc.isHidden ? undefined : tc.input,
                    marks: tc.marks,
                    // Hide expected output and explanation during test
                }));
                return {
                    _id: questionObj._id,
                    title: questionObj.title,
                    problemStatement: questionObj.problemStatement,
                    difficulty: questionObj.difficulty,
                    allowedLanguages: questionObj.allowedLanguages,
                    starterCode: questionObj.starterCode,
                    totalMarks: questionObj.totalMarks,
                    timeLimit: questionObj.timeLimit,
                    memoryLimit: questionObj.memoryLimit
                };
            });
            return res.json(sanitizedQuestions);
        }

        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
};
