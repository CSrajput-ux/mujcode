// Script to clear all UserCourse data from MongoDB
// This ensures all courses show with 0% progress for fresh state

const mongoose = require('mongoose');
const UserCourse = require('../models/mongo/UserCourse');

async function clearUserCourses() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode');
        console.log('Connected to MongoDB');

        // Count existing UserCourse documents
        const count = await UserCourse.countDocuments();
        console.log(`\nFound ${count} UserCourse documents`);

        if (count === 0) {
            console.log('✅ No UserCourse data to clear. Collection is already empty!');
        } else {
            // Delete all UserCourse documents
            const result = await UserCourse.deleteMany({});
            console.log(`\n✅ Successfully deleted ${result.deletedCount} UserCourse documents`);
            console.log('All course progress has been reset to 0%');
        }

        // Verify deletion
        const finalCount = await UserCourse.countDocuments();
        console.log(`\n📊 Final count: ${finalCount} documents in UserCourse collection`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing UserCourse data:', error);
        process.exit(1);
    }
}

clearUserCourses();
