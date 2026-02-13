const mongoose = require('mongoose');

async function setup() {
    const uri = 'mongodb://localhost:27017/mujcode'; // Hardcoded for reliability

    try {
        console.log("🔄 Connecting to MongoDB:", uri);
        await mongoose.connect(uri);
        console.log("✅ Connected.");

        // Define Schema inline to avoid import issues
        const ProblemSchema = new mongoose.Schema({
            number: { type: Number, required: true, unique: true },
            title: { type: String, required: true },
            description: String,
            difficulty: String,
            topic: String,
            testCases: [{
                input: String,
                output: String,
                explanation: String,
                marks: Number,
                isHidden: { type: Boolean, default: false }
            }]
        }, { strict: false });

        const Problem = mongoose.models.Problem || mongoose.model('Problem', ProblemSchema);

        let problem = await Problem.findOne({ number: 1 });
        if (!problem) {
            console.log("⚠️ Problem #1 not found. Creating it...");
            problem = await Problem.create({
                number: 1,
                title: "Two Sum",
                description: "Find indices...",
                difficulty: "Easy",
                topic: "Arrays"
            });
        }

        problem.testCases = [
            {
                input: "2 7 11 15\n9",
                output: "0 1",
                explanation: "2 + 7 = 9",
                marks: 5
            },
            {
                input: "3 2 4\n6",
                output: "1 2",
                explanation: "2 + 4 = 6",
                marks: 5
            }
        ];

        await problem.save();
        console.log("✅ Added test cases to Problem #1");
        console.log("Test Case 1 Input:", JSON.stringify(problem.testCases[0].input));

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

setup();
