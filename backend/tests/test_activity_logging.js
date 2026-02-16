const mongoose = require('mongoose');
const activityService = require('./src/services/activityService');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Use a dummy user ID or one found in your previous dump
        // I'll generate a random one if I can't find one, or use a specific one.
        // Let's use "test-user-123"
        const userId = "test-user-123";

        console.log(`Logging activity for ${userId}...`);
        await activityService.logActivity(userId);

        const Activity = require('./src/models/mongo/Activity');
        const record = await Activity.findOne({ userId });
        console.log('Record found:', record);

        if (record && record.count >= 1) {
            console.log('✅ SUCCESS: Activity logged.');
        } else {
            console.error('❌ FAILURE: Record not found or count wrong.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ ERROR:', error);
        process.exit(1);
    }
};

run();
