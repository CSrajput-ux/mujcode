<<<<<<< HEAD
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const { sequelize } = require('../src/config/database');
const User = require('../src/models/pg/User');

// Hardcoding schemas to avoid import issues for this test script
const ProblemSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    topic: String,
    category: String,
    createdAt: { type: Date, default: Date.now }
});
const Problem = mongoose.models.Problem || mongoose.model('Problem', ProblemSchema);

const StudentProgressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    solvedProblemIds: [Number],
    attemptedProblemIds: [Number]
});
const StudentProgress = mongoose.models.StudentProgress || mongoose.model('StudentProgress', StudentProgressSchema);


async function simulateSolution() {
    try {
        console.log("🔄 Connecting to Database...");
        await mongoose.connect(process.env.MONGODB_URI);
        await sequelize.authenticate();

        const email = "chhotu.2427030521@muj.manipal.edu";
        const problemNumber = 1;

        // 1. Get User ID
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.error("❌ User not found:", email);
            return;
        }
        console.log(`✅ Found User: ${user.email} (${user.id})`);

        // 2. Ensure Problem Exists
        let problem = await Problem.findOne({ number: problemNumber });
        if (!problem) {
            console.log("⚠️ Problem #1 not found. Creating it...");
            problem = await Problem.create({
                number: 1,
                title: "Two Sum",
                description: "Find indices of two numbers that add up to target.",
                difficulty: "Easy",
                topic: "Arrays",
                category: "Algorithms"
            });
            console.log("✅ Created Problem #1");
        }

        // 3. Update Student Progress
        let progress = await StudentProgress.findOne({ userId: user.id });
        if (!progress) {
            console.log("⚠️ No progress found. Creating new progress record...");
            progress = new StudentProgress({
                userId: user.id,
                solvedProblemIds: [],
                attemptedProblemIds: []
            });
        }

        if (!progress.solvedProblemIds.includes(problemNumber)) {
            progress.solvedProblemIds.push(problemNumber);
            await progress.save();
            console.log(`\n🎉 SUCCESS: Marked Problem #${problemNumber} as SOLVED for ${user.name}`);
        } else {
            console.log(`\nℹ️ Problem #${problemNumber} is ALREADY marked as solved.`);
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.disconnect();
        await sequelize.close();
    }
}

simulateSolution();
=======
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const { sequelize } = require('../src/config/database');
const User = require('../src/models/pg/User');

// Hardcoding schemas to avoid import issues for this test script
const ProblemSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    topic: String,
    category: String,
    createdAt: { type: Date, default: Date.now }
});
const Problem = mongoose.models.Problem || mongoose.model('Problem', ProblemSchema);

const StudentProgressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    solvedProblemIds: [Number],
    attemptedProblemIds: [Number]
});
const StudentProgress = mongoose.models.StudentProgress || mongoose.model('StudentProgress', StudentProgressSchema);


async function simulateSolution() {
    try {
        console.log("🔄 Connecting to Database...");
        await mongoose.connect(process.env.MONGODB_URI);
        await sequelize.authenticate();

        const email = "chhotu.2427030521@muj.manipal.edu";
        const problemNumber = 1;

        // 1. Get User ID
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.error("❌ User not found:", email);
            return;
        }
        console.log(`✅ Found User: ${user.email} (${user.id})`);

        // 2. Ensure Problem Exists
        let problem = await Problem.findOne({ number: problemNumber });
        if (!problem) {
            console.log("⚠️ Problem #1 not found. Creating it...");
            problem = await Problem.create({
                number: 1,
                title: "Two Sum",
                description: "Find indices of two numbers that add up to target.",
                difficulty: "Easy",
                topic: "Arrays",
                category: "Algorithms"
            });
            console.log("✅ Created Problem #1");
        }

        // 3. Update Student Progress
        let progress = await StudentProgress.findOne({ userId: user.id });
        if (!progress) {
            console.log("⚠️ No progress found. Creating new progress record...");
            progress = new StudentProgress({
                userId: user.id,
                solvedProblemIds: [],
                attemptedProblemIds: []
            });
        }

        if (!progress.solvedProblemIds.includes(problemNumber)) {
            progress.solvedProblemIds.push(problemNumber);
            await progress.save();
            console.log(`\n🎉 SUCCESS: Marked Problem #${problemNumber} as SOLVED for ${user.name}`);
        } else {
            console.log(`\nℹ️ Problem #${problemNumber} is ALREADY marked as solved.`);
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.disconnect();
        await sequelize.close();
    }
}

simulateSolution();
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
