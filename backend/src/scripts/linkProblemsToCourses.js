// File: src/scripts/linkProblemsToCourses.js
// Migration script to link existing problems to their respective courses

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Problem = require('../models/mongo/Problem');
const Course = require('../models/mongo/Course');

// Mapping from JSON file names to course titles
const fileToCourseMapping = {
    'c_programming_fundamentals.json': 'C Programming Fundamentals',
    'cpp_fundamentals.json': 'C++ Fundamentals',
    'java_fundamentals.json': 'Java Fundamentals',
    'python_fundamentals.json': 'Python Fundamentals',
    'javascript_essentials.json': 'JavaScript Essentials',
    'sql_fundamentals.json': 'SQL Fundamentals',
    'dsa_for_beginners.json': 'DSA for Beginners',
    'advanced_dsa.json': 'Advanced Algorithms',
    'interview_preparation.json': 'Coding Interview Preparation',
    'web_development_basics.json': 'Web Development Basics',
    'oop_concepts.json': 'OOP Concepts',
    'competitive_programming.json': 'Competitive Programming',
    'database_management.json': 'Database Management Systems',
    'operating_systems.json': 'Operating Systems Concepts',
    'computer_networks.json': 'Computer Networks',
    'machine_learning_basics.json': 'Machine Learning Basics'
};

async function linkProblemsToCourses() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mujcode');
        console.log('✅ Connected to MongoDB');

        const questionsDir = path.join(__dirname, '../data/questions');

        // Check if directory exists
        if (!fs.existsSync(questionsDir)) {
            console.error('❌ Questions directory not found:', questionsDir);
            process.exit(1);
        }

        // Get all JSON files
        const files = fs.readdirSync(questionsDir).filter(f => f.endsWith('.json'));
        console.log(`📁 Found ${files.length} question files\n`);

        // Fetch all courses once
        const allCourses = await Course.find({});
        console.log(`📚 Found ${allCourses.length} courses in database\n`);

        let totalLinked = 0;
        let totalNotFound = 0;
        const courseStats = {};

        for (const file of files) {
            const filePath = path.join(questionsDir, file);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            console.log(`📄 Processing: ${file}`);

            // Get expected course title from mapping
            const expectedCourseTitle = fileToCourseMapping[file];

            if (!expectedCourseTitle) {
                console.log(`   ⚠️  No course mapping found for ${file}, skipping...`);
                continue;
            }

            // Find the course in database (case-insensitive)
            const course = allCourses.find(c =>
                c.title.toLowerCase() === expectedCourseTitle.toLowerCase()
            );

            if (!course) {
                console.log(`   ❌ Course "${expectedCourseTitle}" not found in database`);
                console.log(`   💡 Run: node src/scripts/seedCourses.js first\n`);
                continue;
            }

            console.log(`   ✓ Found course: "${course.title}" (${course._id})`);

            // Get problem numbers from this file
            const problemNumbers = data.questions.map(q => q.number);
            console.log(`   📝 Processing ${problemNumbers.length} problems...`);

            // Update all problems from this file with the courseId
            const result = await Problem.updateMany(
                { number: { $in: problemNumbers } },
                { $set: { courseId: course._id } }
            );

            console.log(`   ✅ Linked ${result.modifiedCount} problems to course "${course.title}"\n`);

            totalLinked += result.modifiedCount;
            courseStats[course.title] = (courseStats[course.title] || 0) + result.modifiedCount;

            // Track problems that weren't found
            if (result.modifiedCount < problemNumbers.length) {
                totalNotFound += (problemNumbers.length - result.modifiedCount);
            }
        }

        // Update totalProblems count for each course
        console.log('\n📊 Updating course problem counts...\n');
        for (const [courseTitle, count] of Object.entries(courseStats)) {
            await Course.updateOne(
                { title: courseTitle },
                { $set: { totalProblems: count } }
            );
            console.log(`   ✓ ${courseTitle}: ${count} problems`);
        }

        console.log(`\n✅ Migration complete!`);
        console.log(`   📊 Total problems linked: ${totalLinked}`);
        if (totalNotFound > 0) {
            console.log(`   ⚠️  Problems not found in DB: ${totalNotFound}`);
        }

        // Show final statistics
        console.log('\n📈 Final Course Statistics:');
        const courseWithProblems = await Course.find({ totalProblems: { $gt: 0 } })
            .sort({ category: 1, title: 1 });

        let grandTotal = 0;
        courseWithProblems.forEach(c => {
            console.log(`   ${c.category.padEnd(12)} | ${c.title.padEnd(40)} | ${c.totalProblems} problems`);
            grandTotal += c.totalProblems;
        });
        console.log(`\n   🎯 Total: ${courseWithProblems.length} courses with ${grandTotal} problems`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

// Run the migration
linkProblemsToCourses();
