// File: src/scripts/seedProblems.js
// Seeds all problems from JSON files into MongoDB

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Problem = require('../models/mongo/Problem');

// Mapping from JSON courseName/category to Problem model category
const categoryMapping = {
    'C Programming Fundamentals': 'C Programming',
    'C++': 'Algorithms',
    'C++ Fundamentals': 'Algorithms',
    'Java Fundamentals': 'Algorithms',
    'Python Fundamentals': 'Python',
    'JavaScript Essentials': 'JavaScript',
    'SQL Fundamentals': 'Database',
    'DSA for Beginners': 'Data Structures',
    'Interview Preparation': 'Algorithms',
    'Web Development Basics': 'Web Development',
    'Advanced DSA': 'Data Structures',
    'Object Oriented Programming': 'OOPs',
    'OOP': 'OOPs',
    'Competitive Programming': 'Algorithms',
    'Competitive': 'Algorithms',
    'Database Management': 'Database',
    'Database': 'Database',
    'Operating Systems Concepts': 'Operating Systems',
    'Systems': 'Operating Systems',
    'Machine Learning Basics': 'Python',
    'ML/AI': 'Python',
    'Computer Networks': 'Computer Networks',
    'Networks': 'Computer Networks'
};

// Extract topic from question context
function getTopicFromQuestion(question, courseName) {
    // Default topics based on course
    const topicMapping = {
        'C Programming Fundamentals': 'Basics',
        'C++ Fundamentals': 'Basics',
        'Java Fundamentals': 'Basics',
        'Python Fundamentals': 'Basics',
        'JavaScript Essentials': 'Basics',
        'SQL Fundamentals': 'SQL Queries',
        'DSA for Beginners': 'Arrays',
        'Interview Preparation': 'Problem Solving',
        'Web Development Basics': 'HTML/CSS',
        'Advanced DSA': 'Advanced Algorithms',
        'Object Oriented Programming': 'OOP Concepts',
        'Competitive Programming': 'Competitive',
        'Database Management': 'Database Design',
        'Operating Systems Concepts': 'OS Concepts',
        'Machine Learning Basics': 'Machine Learning',
        'Computer Networks': 'Networking'
    };

    // Try to get from question title
    const title = question.title.toLowerCase();
    if (title.includes('array')) return 'Arrays';
    if (title.includes('string')) return 'Strings';
    if (title.includes('linked list')) return 'Linked List';
    if (title.includes('tree') || title.includes('bst')) return 'Trees';
    if (title.includes('graph')) return 'Graphs';
    if (title.includes('dp') || title.includes('dynamic')) return 'Dynamic Programming';
    if (title.includes('sort')) return 'Sorting';
    if (title.includes('search')) return 'Searching';
    if (title.includes('stack')) return 'Stack';
    if (title.includes('queue')) return 'Queue';
    if (title.includes('hash')) return 'Hash Table';
    if (title.includes('recursion')) return 'Recursion';
    if (title.includes('binary')) return 'Binary Search';
    if (title.includes('sql') || title.includes('query')) return 'SQL Queries';
    if (title.includes('join')) return 'SQL Joins';

    return topicMapping[courseName] || 'General';
}

async function seedProblems() {
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
        console.log(`📁 Found ${files.length} question files`);

        let totalInserted = 0;
        let totalSkipped = 0;

        for (const file of files) {
            const filePath = path.join(questionsDir, file);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            console.log(`\n📄 Processing: ${data.courseName || file}`);

            const courseName = data.courseName || file.replace('.json', '');
            const category = categoryMapping[courseName] || categoryMapping[data.category] || 'Algorithms';

            for (const question of data.questions) {
                try {
                    // Check if problem already exists
                    const existing = await Problem.findOne({ number: question.number });
                    if (existing) {
                        totalSkipped++;
                        continue;
                    }

                    // Transform test cases
                    const testCases = (question.testCases || []).map(tc => ({
                        input: tc.input,
                        output: tc.expectedOutput
                    }));

                    // Create problem document
                    const problem = new Problem({
                        number: question.number,
                        title: question.title,
                        description: question.description,
                        difficulty: question.difficulty,
                        points: question.points || (question.difficulty === 'Easy' ? 5 : question.difficulty === 'Medium' ? 7 : 10),
                        category: category,
                        topic: getTopicFromQuestion(question, courseName),
                        tags: [category, question.difficulty],
                        testCases: testCases,
                        constraints: question.constraints ? [question.constraints] : [],
                        examples: [{
                            input: question.sampleInput || '',
                            output: question.sampleOutput || '',
                            explanation: question.explanation || ''
                        }]
                    });

                    await problem.save();
                    totalInserted++;
                    process.stdout.write('.');
                } catch (err) {
                    console.error(`\n❌ Error inserting problem ${question.number}:`, err.message);
                }
            }
        }

        console.log(`\n\n✅ Seeding complete!`);
        console.log(`   📊 Inserted: ${totalInserted} problems`);
        console.log(`   ⏭️  Skipped (existing): ${totalSkipped} problems`);

        // Show category distribution
        const categories = await Problem.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        console.log('\n📊 Problems by Category:');
        categories.forEach(c => console.log(`   ${c._id}: ${c.count}`));

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

// Run the seeder
seedProblems();
