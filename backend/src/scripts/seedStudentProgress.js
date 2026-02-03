// Seed script to create sample student progress data for testing analytics
const mongoose = require('mongoose');
const StudentProgress = require('../models/mongo/StudentProgress');
const Problem = require('../models/mongo/Problem');

async function seedStudentProgress() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode');
        console.log('Connected to MongoDB');

        // Student ID (college_id from PostgreSQL)
        const studentId = 247030521; // Chhotu's college ID

        // Check if progress already exists
        let progress = await StudentProgress.findOne({ userId: studentId });

        if (!progress) {
            progress = new StudentProgress({ userId: studentId });
            console.log('Created new StudentProgress for student:', studentId);
        } else {
            console.log('Found existing StudentProgress for student:', studentId);
        }

        // Get some problems to mark as solved
        const problems = await Problem.find().limit(15);
        console.log('Found', problems.length, 'problems to mark as solved');

        // Mark problems as solved with dates spread over last 30 days
        const today = new Date();
        for (let i = 0; i < problems.length; i++) {
            const problem = problems[i];
            const daysAgo = Math.floor(Math.random() * 30); // Random day in last 30 days
            const solvedDate = new Date(today);
            solvedDate.setDate(today.getDate() - daysAgo);

            // Check if already solved
            if (!progress.solvedProblemIds.includes(problem.number)) {
                progress.solvedProblemIds.push(problem.number);
                progress.totalSolved = progress.solvedProblemIds.length;
                progress.totalPoints += problem.points;

                // Add to submissions with correct schema
                progress.submissions.push({
                    problemId: problem._id, // Use ObjectId
                    difficulty: problem.difficulty.toLowerCase(), // easy, medium, hard
                    solvedAt: solvedDate,
                    status: 'accepted'
                });

                console.log(`Marked Problem #${problem.number} (${problem.title}) as solved - ${problem.points} points`);
            }
        }

        await progress.save();

        console.log('\n✅ Sample progress created successfully!');
        console.log(`Total problems solved: ${progress.totalSolved}`);
        console.log(`Total points: ${progress.totalPoints}`);
        console.log(`Submissions: ${progress.submissions.length}`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding student progress:', error);
        process.exit(1);
    }
}

seedStudentProgress();
