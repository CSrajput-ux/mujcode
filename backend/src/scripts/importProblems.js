// File: src/scripts/importProblems.js
const mongoose = require('mongoose');
const Problem = require('../models/mongo/Problem');
const fs = require('fs');
const path = require('path');

async function importProblems() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode');
        console.log('✅ Connected to MongoDB');

        // Read the JSON file
        const filePath = path.join(__dirname, '../../problems_dataset.json');
        const data = fs.readFileSync(filePath, 'utf8');
        const problems = JSON.parse(data);

        console.log(`📁 Found ${problems.length} problems in dataset`);

        // Clear existing problems (optional - comment out to keep existing)
        const deleteResult = await Problem.deleteMany({});
        console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing problems`);

        // Insert new problems
        const result = await Problem.insertMany(problems);
        console.log(`✅ Successfully imported ${result.length} problems!`);

        // Display summary
        console.log('\n📊 Import Summary:');
        const easy = problems.filter(p => p.difficulty === 'Easy').length;
        const medium = problems.filter(p => p.difficulty === 'Medium').length;
        const hard = problems.filter(p => p.difficulty === 'Hard').length;

        console.log(`   - Easy: ${easy}`);
        console.log(`   - Medium: ${medium}`);
        console.log(`   - Hard: ${hard}`);
        console.log(`   - Total: ${problems.length}`);

        // Show imported problems
        console.log('\n📝 Imported Problems:');
        problems.forEach((p, idx) => {
            console.log(`   ${idx + 1}. [${p.difficulty}] ${p.title} (${p.topic})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error importing problems:', error);
        process.exit(1);
    }
}

// Run the import
importProblems();
