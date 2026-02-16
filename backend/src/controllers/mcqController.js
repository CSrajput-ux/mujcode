const MCQQuestion = require('../models/mongo/MCQQuestion');
const Test = require('../models/mongo/Test');

// Create a new MCQ question for a test
exports.createMCQQuestion = async (req, res) => {
    try {
        const { testId } = req.params;
        const { questionText, options, correctAnswers, multipleCorrect, marks, explanation, order } = req.body;

        // Verify test exists and is of MCQ type
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        if (test.testType !== 'MCQ') {
            return res.status(400).json({ message: 'This test is not an MCQ test' });
        }

        // Create MCQ question
        const mcqQuestion = new MCQQuestion({
            testId,
            questionText,
            options,
            correctAnswers,
            multipleCorrect,
            marks,
            explanation,
            order: order || test.mcqQuestions.length
        });

        await mcqQuestion.save();

        // Add question reference to test
        test.mcqQuestions.push(mcqQuestion._id);
        await test.save();

        res.status(201).json({
            message: 'MCQ question created successfully',
            questionId: mcqQuestion._id,
            question: mcqQuestion
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating MCQ question', error: error.message });
    }
};

// Get all MCQ questions for a test
exports.getMCQQuestions = async (req, res) => {
    try {
        const { testId } = req.params;
        const questions = await MCQQuestion.find({ testId }).sort({ order: 1 });

        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching MCQ questions', error: error.message });
    }
};

// Get single MCQ question by ID
exports.getMCQQuestionById = async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await MCQQuestion.findById(questionId);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json(question);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching question', error: error.message });
    }
};

// Update MCQ question
exports.updateMCQQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const updateData = req.body;

        const question = await MCQQuestion.findByIdAndUpdate(
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

// Delete MCQ question
exports.deleteMCQQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        const question = await MCQQuestion.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Remove from test's question array
        await Test.findByIdAndUpdate(
            question.testId,
            { $pull: { mcqQuestions: questionId } }
        );

        await MCQQuestion.findByIdAndDelete(questionId);

        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting question', error: error.message });
    }
};

// Get MCQ questions for students (hides correct answers during test)
exports.getMCQQuestionsForStudent = async (req, res) => {
    try {
        const { testId } = req.params;
        const { showAnswers } = req.query; // Set to true after test completion

        const questions = await MCQQuestion.find({ testId }).sort({ order: 1 });

        // If test is not completed, hide correct answers
        if (showAnswers !== 'true') {
            const sanitizedQuestions = questions.map(q => {
                const { correctAnswers, explanation, ...rest } = q.toObject();
                return rest;
            });
            return res.json(sanitizedQuestions);
        }

        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
};
