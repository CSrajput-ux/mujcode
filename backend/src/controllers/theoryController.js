const TheoryQuestion = require('../models/mongo/TheoryQuestion');
const Test = require('../models/mongo/Test');

// Create a new theory question for a test
exports.createTheoryQuestion = async (req, res) => {
    try {
        const { testId } = req.params;
        const { questionText, modelAnswer, keywords, maxMarks, evaluationCriteria, order } = req.body;

        // Verify test exists and is of Theory type
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        if (test.testType !== 'Theory') {
            return res.status(400).json({ message: 'This test is not a Theory test' });
        }

        // Create theory question
        const theoryQuestion = new TheoryQuestion({
            testId,
            questionText,
            modelAnswer,
            keywords,
            maxMarks,
            evaluationCriteria,
            order: order || test.theoryQuestions.length
        });

        await theoryQuestion.save();

        // Add question reference to test
        test.theoryQuestions.push(theoryQuestion._id);
        await test.save();

        res.status(201).json({
            message: 'Theory question created successfully',
            questionId: theoryQuestion._id,
            question: theoryQuestion
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating theory question', error: error.message });
    }
};

// Get all theory questions for a test
exports.getTheoryQuestions = async (req, res) => {
    try {
        const { testId } = req.params;
        const questions = await TheoryQuestion.find({ testId }).sort({ order: 1 });

        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching theory questions', error: error.message });
    }
};

// Get single theory question by ID
exports.getTheoryQuestionById = async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await TheoryQuestion.findById(questionId);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json(question);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching question', error: error.message });
    }
};

// Update theory question
exports.updateTheoryQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const updateData = req.body;

        const question = await TheoryQuestion.findByIdAndUpdate(
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

// Delete theory question
exports.deleteTheoryQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        const question = await TheoryQuestion.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Remove from test's question array
        await Test.findByIdAndUpdate(
            question.testId,
            { $pull: { theoryQuestions: questionId } }
        );

        await TheoryQuestion.findByIdAndDelete(questionId);

        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting question', error: error.message });
    }
};

// Get theory questions for students (hides model answer and keywords)
exports.getTheoryQuestionsForStudent = async (req, res) => {
    try {
        const { testId } = req.params;
        const { showAnswers } = req.query; // Set to true after test completion

        const questions = await TheoryQuestion.find({ testId }).sort({ order: 1 });

        // If test is not completed, hide model answers and keywords
        if (showAnswers !== 'true') {
            const sanitizedQuestions = questions.map(q => {
                const { modelAnswer, keywords, evaluationCriteria, ...rest } = q.toObject();
                return rest;
            });
            return res.json(sanitizedQuestions);
        }

        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
};
