const mongoose = require('mongoose');

/**
 * Create database indexes for optimized queries
 * Run this once during deployment or database setup
 */
async function createIndexes() {
    try {
        console.log('🔧 Creating MongoDB indexes...');

        // User Collection Indexes
        const User = mongoose.model('User');
        await User.collection.createIndex({ email: 1 }, { unique: true });
        await User.collection.createIndex({ role: 1 });
        console.log('✅ User indexes created');

        // Submission Collection Indexes
        const Submission = mongoose.model('Submission');
        await Submission.collection.createIndex({ userId: 1 });
        await Submission.collection.createIndex({ problemId: 1 });
        await Submission.collection.createIndex({ userId: 1, problemId: 1 });
        await Submission.collection.createIndex({ createdAt: -1 }); // For sorting by latest
        console.log('✅ Submission indexes created');

        // Problem Collection Indexes
        const Problem = mongoose.model('Problem');
        await Problem.collection.createIndex({ difficulty: 1 });
        await Problem.collection.createIndex({ status: 1 });
        await Problem.collection.createIndex({ category: 1 });
        await Problem.collection.createIndex({ tags: 1 });
        console.log('✅ Problem indexes created');

        // Course Collection Indexes
        const Course = mongoose.model('Course');
        await Course.collection.createIndex({ title: 'text', description: 'text' }); // Text search
        await Course.collection.createIndex({ status: 1 });
        console.log('✅ Course indexes created');

        // Test Collection Indexes
        const Test = mongoose.model('Test');
        await Test.collection.createIndex({ createdBy: 1 });
        await Test.collection.createIndex({ status: 1 });
        await Test.collection.createIndex({ publishDate: 1 });
        console.log('✅ Test indexes created');

        console.log('🎉 All MongoDB indexes created successfully!');
    } catch (error) {
        console.error('❌ Error creating indexes:', error);
        throw error;
    }
}

module.exports = { createIndexes };
