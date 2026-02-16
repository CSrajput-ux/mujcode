const mongoose = require('mongoose');
const StudentProgress = require('../models/mongo/StudentProgress');
const Problem = require('../models/mongo/Problem');
require('dotenv').config();

const recalculatePoints = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Fetch all problems to create a lookup map
        const problems = await Problem.find({});
        const problemMap = {};
        problems.forEach(p => {
            // Map both ObjectId and Number to points
            problemMap[p._id.toString()] = p.points;
            problemMap[p.number] = p.points;
        });

        const allProgress = await StudentProgress.find({});
        console.log(`Found ${allProgress.length} student progress records.`);

        for (const progress of allProgress) {
            let recalcuatedPoints = 0;

            // Recalculate based on solvedProblemIds (which are usually numbers)
            // But wait, solvedProblemIds is array of Numbers.
            // Submissions has problemId (ObjectId).

            // Let's use submissions as source of truth for "Accepted" ones, 
            // OR use solvedProblemIds if that's the primary tracking.
            // The model logic in addSolvedProblem updates solvedProblemIds AND submissions.
            // Let's iterate over solvedProblemIds as it's cleaner for uniqueness.

            if (progress.solvedProblemIds && progress.solvedProblemIds.length > 0) {
                for (const problemNum of progress.solvedProblemIds) {
                    const points = problemMap[problemNum] || 0; // Default to 0 if not found (should be rare)
                    if (points === 0) console.warn(`⚠️ Problem ${problemNum} not found in Problem DB or has 0 points.`);
                    recalcuatedPoints += points;
                }
            }

            // Add points from Tests
            if (progress.completedTests && progress.completedTests.length > 0) {
                recalcuatedPoints += (progress.completedTests.length * 20);
            }

            // Add points from Assignments
            // We need to know type of assignment to give correct points.
            // But `completedAssignments` is just IDs.
            // Ideally we should have stored points in `completedAssignments` or look them up.
            // For now, let's assume 10 points for standard assignment if we can't look it up easily,
            // OR ignore if we can't be sure.
            // Given the previous code just pushed IDs, we might have to fetch Assignments to check type.
            // Let's start with 0 for assignments to be safe, or just keep existing assignment points if any.
            // Actually, `totalPoints` is a single field. We need to reconstruct it completely.

            // For this specific fix, the user only has Problem points issues.
            // I will strictly recalculate Problem points and ADD any "extra" points (tests/assignments) 
            // by assuming the difference comes from there? No that's risky.

            // Correct approach:
            // 1. Calculate points from Problems.
            // 2. Calculate points from Tests (20 each).
            // 3. Calculate points from Assignments (fetch them).

            // Since we just implemented Test/Assignment logic, existing users likely have 0 there.
            // The user "Chhotu" has 0 tests/assignments.

            if (progress.completedAssignments && progress.completedAssignments.length > 0) {
                const Assignment = require('../models/mongo/Assignment');
                const assignments = await Assignment.find({ _id: { $in: progress.completedAssignments } });

                assignments.forEach(a => {
                    if (a.type === 'CaseStudy') recalcuatedPoints += 50;
                    else if (a.type === 'Research') recalcuatedPoints += 100;
                    else recalcuatedPoints += 10;
                });
            }

            if (progress.totalPoints !== recalcuatedPoints) {
                console.log(`🔄 Updating user ${progress.userId}: ${progress.totalPoints} -> ${recalcuatedPoints}`);
                progress.totalPoints = recalcuatedPoints;
                try {
                    await progress.save();
                } catch (err) {
                    console.error(`❌ Failed to update user ${progress.userId}:`, err.message);
                }
            }
        }

        console.log('✅ Recalculation Complete');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

recalculatePoints();
