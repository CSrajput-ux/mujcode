// File: src/scripts/checkProblems.js
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Problem = require('../models/mongo/Problem');

async function check() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mujcode');

    const count = await Problem.countDocuments();
    console.log('Total problems in MongoDB:', count);

    const cats = await Problem.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    console.log('\nProblems by Category:');
    cats.forEach(c => console.log(`  ${c._id}: ${c.count}`));

    await mongoose.disconnect();
}

check();
