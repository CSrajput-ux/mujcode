require('dotenv').config();
const mongoose = require('mongoose');
const Problem = require('../src/models/mongo/Problem');

async function setup() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB.");

        const problem = await Problem.findOne({ number: 1 });
        if (!problem) {
            console.error("Problem #1 not found. Run simulate_solution.js first.");
            return;
        }

        // Add Test Cases for Two Sum
        /*
          Input format: 
          Line 1: Array elements space separated
          Line 2: Target
        */
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

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

setup();
