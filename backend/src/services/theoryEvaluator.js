const TheoryQuestion = require('../models/mongo/TheoryQuestion');

// Simple keyword-based evaluation (can be enhanced with AI later)
class TheoryEvaluator {
    /**
     * Evaluate a theory answer based on keywords and model answer
     * @param {string} studentAnswer - Student's submitted answer
     * @param {string} modelAnswer - Faculty's model answer
     * @param {Array<string>} keywords - Important keywords to check
     * @param {number} maxMarks - Maximum marks for the question
     * @returns {Object} - Evaluation result with marks, feedback, and matched keywords
     */
    evaluateAnswer(studentAnswer, modelAnswer, keywords, maxMarks) {
        const answer = studentAnswer.toLowerCase().trim();

        if (!answer || answer.length < 10) {
            return {
                marks: 0,
                maxMarks,
                percentage: 0,
                matchedKeywords: [],
                feedback: 'Answer is too short or empty.',
                confidence: 'high'
            };
        }

        // Keyword matching
        const matchedKeywords = keywords.filter(keyword =>
            answer.includes(keyword.toLowerCase())
        );

        const keywordScore = keywords.length > 0
            ? (matchedKeywords.length / keywords.length)
            : 0;

        // Length comparison (student answer should be reasonably long)
        const modelLength = modelAnswer.split(' ').length;
        const studentLength = answer.split(' ').length;
        const lengthRatio = Math.min(studentLength / modelLength, 1);
        const lengthScore = lengthRatio > 0.5 ? 1 : lengthRatio * 2;

        // Combined score (70% keywords, 30% length)
        const combinedScore = (keywordScore * 0.7) + (lengthScore * 0.3);
        const marks = Math.round(combinedScore * maxMarks);

        // Generate feedback
        const feedback = this.generateFeedback(
            matchedKeywords,
            keywords,
            keywordScore,
            lengthScore
        );

        return {
            marks,
            maxMarks,
            percentage: Math.round((marks / maxMarks) * 100),
            matchedKeywords,
            totalKeywords: keywords.length,
            feedback,
            confidence: keywordScore > 0.7 ? 'high' : keywordScore > 0.4 ? 'medium' : 'low'
        };
    }

    /**
     * Generate human-readable feedback
     */
    generateFeedback(matchedKeywords, allKeywords, keywordScore, lengthScore) {
        const feedback = [];

        // Keyword feedback
        if (keywordScore >= 0.8) {
            feedback.push('✓ Excellent coverage of key concepts.');
        } else if (keywordScore >= 0.5) {
            feedback.push('○ Good understanding, but some key points are missing.');
        } else {
            feedback.push('✗ Missing several important concepts.');
        }

        // Missing keywords
        const missingKeywords = allKeywords.filter(
            kw => !matchedKeywords.map(m => m.toLowerCase()).includes(kw.toLowerCase())
        );
        if (missingKeywords.length > 0 && missingKeywords.length <= 3) {
            feedback.push(`Missing keywords: ${missingKeywords.join(', ')}`);
        }

        // Length feedback
        if (lengthScore < 0.5) {
            feedback.push('○ Answer could be more detailed.');
        }

        return feedback.join(' ');
    }

    /**
     * Evaluate multiple questions
     */
    async evaluateTest(answers, questionIds) {
        const results = [];
        let totalScore = 0;
        let maxScore = 0;

        for (let i = 0; i < questionIds.length; i++) {
            const questionId = questionIds[i];
            const studentAnswer = answers[questionId] || '';

            // Fetch question
            const question = await TheoryQuestion.findById(questionId);
            if (!question) {
                results.push({
                    questionId,
                    error: 'Question not found',
                    marks: 0,
                    maxMarks: 0
                });
                continue;
            }

            // Evaluate
            const evaluation = this.evaluateAnswer(
                studentAnswer,
                question.modelAnswer,
                question.keywords,
                question.maxMarks
            );

            results.push({
                questionId,
                questionText: question.questionText,
                studentAnswer,
                ...evaluation
            });

            totalScore += evaluation.marks;
            maxScore += evaluation.maxMarks;
        }

        return {
            results,
            totalScore,
            maxScore,
            percentage: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
        };
    }
}

module.exports = new TheoryEvaluator();
