const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Course = require('../models/mongo/Course');
const Problem = require('../models/mongo/Problem');

const courseData = {
    title: 'Coding Interview Preparation',
    // We will only update fields if necessary or found
    // description: 'Crack coding interviews with essential algorithms and problem-solving patterns.', 
    // category: 'Interview',
    // difficulty: 'Medium',
    totalProblems: 165, // Update to match our set
    // icon: 'target'
};

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mujcode');
        console.log('Connected to MongoDB');

        // 1. Find Course
        let course = await Course.findOne({ title: courseData.title });
        if (!course) {
            console.log("Course 'Coding Interview Preparation' not found. Creating it...");
            course = new Course({
                title: courseData.title,
                description: 'Crack coding interviews with essential algorithms and problem-solving patterns.',
                category: 'Interview',
                difficulty: 'Medium',
                totalProblems: courseData.totalProblems,
                icon: 'target'
            });
            await course.save();
        } else {
            // Update existing with new problem count
            course.totalProblems = courseData.totalProblems; // Verify if we want to add or set. User usually implies these ARE the questions.
            // We'll set it to 165 to be accurate to THIS batch.
            await course.save();
            console.log('Updated existing course:', course.title);
        }

        // 2. Read Questions JSON
        const jsonPath = path.join(__dirname, '../data/questions/dsa_interview_questions.json');
        if (!fs.existsSync(jsonPath)) {
            throw new Error('Questions JSON not found');
        }
        const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const questions = jsonData.questions;

        console.log(`Found ${questions.length} questions to seed.`);

        let inserted = 0;
        let updated = 0;

        for (const q of questions) {
            // Check if problem exists
            let problem = await Problem.findOne({ number: q.number });

            const problemData = {
                number: q.number,
                title: q.title,
                description: q.description,
                difficulty: q.difficulty,
                points: q.difficulty === 'Easy' ? 5 : q.difficulty === 'Medium' ? 7 : 10,
                category: 'Algorithms', // Default to algorithms
                topic: q.topic || 'General',
                tags: q.tags, // Already includes companies
                courseId: course._id,
                constraints: q.constraints ? [q.constraints] : [],
                testCases: [], // We don't have real test cases but parser creates empty array
                examples: [{
                    input: q.sampleInput || '',
                    output: q.sampleOutput || '',
                    explanation: q.explanation || ''
                }]
            };

            if (!problem) {
                problem = new Problem(problemData);
                await problem.save();
                inserted++;
            } else {
                // Update existing
                Object.assign(problem, problemData);
                await problem.save();
                updated++;
            }
            if ((inserted + updated) % 20 === 0) process.stdout.write('.');
        }

        console.log(`\nSeeding Complete.`);
        console.log(`Inserted: ${inserted}`);
        console.log(`Updated: ${updated}`);

        process.exit(0);

    } catch (err) {
        console.error('Seeding failed:', err.message);
        if (err.errors) {
            Object.keys(err.errors).forEach(key => {
                console.error(`Validation Error [${key}]: ${err.errors[key].message}`);
            });
        }
        process.exit(1);
    }
}

seed();
