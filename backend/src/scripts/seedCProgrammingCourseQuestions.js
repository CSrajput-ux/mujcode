const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Course = require('../models/mongo/Course');
const Problem = require('../models/mongo/Problem');

async function seed() {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/mujcode';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // 1. Find the C Programming Fundamentals Course
        const courseTitle = 'C Programming Fundamentals';
        let course = await Course.findOne({ title: courseTitle });

        if (!course) {
            console.error(`Course "${courseTitle}" not found! Make sure you have seeded courses first.`);
            process.exit(1);
        }
        console.log(`Found Course: ${course.title} (ID: ${course._id})`);

        // 2. Read the parsed JSON
        const jsonPath = path.join(__dirname, '../data/questions/c_fundamentals_questions.json');
        if (!fs.existsSync(jsonPath)) {
            console.error('Parsed JSON not found. Run the parser first.');
            process.exit(1);
        }
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const questions = data.questions;

        console.log(`Seeding ${questions.length} questions...`);

        let inserted = 0;
        let updated = 0;

        for (const q of questions) {
            // Check if exists by number
            let problem = await Problem.findOne({ number: q.number });

            const problemData = {
                number: q.number,
                title: q.title,
                description: q.description,
                difficulty: q.difficulty,
                category: 'C Programming',
                topic: q.topic,
                tags: q.tags,
                courseId: course._id,
                constraints: q.constraints,
                testCases: q.testCases,
                examples: q.examples,
                points: q.difficulty === 'Easy' ? 5 : q.difficulty === 'Medium' ? 7 : 10
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

            if ((inserted + updated) % 25 === 0) {
                process.stdout.write('.');
            }
        }

        console.log(`\n\n✅ Seeding Complete for "${courseTitle}"`);
        console.log(`Inserted: ${inserted}`);
        console.log(`Updated: ${updated}`);
        console.log(`Total problems in course: ${inserted + updated}`);

        // Update totalProblems count in Course if it changed
        course.totalProblems = 150;
        await course.save();

        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seed();
