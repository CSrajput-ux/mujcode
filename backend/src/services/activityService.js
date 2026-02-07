const Activity = require('../models/mongo/Activity');

exports.logActivity = async (userId) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Atomic Upsert: Increment count if exists, else create with count=1
        await Activity.findOneAndUpdate(
            { userId: String(userId), date: today },
            { $inc: { count: 1 } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log(`📈 Activity logged for user ${userId} on ${today}`);
    } catch (error) {
        console.error('Error logging activity:', error);
        // We do not throw here to prevent blocking the main flow (submission/test)
    }
};

exports.getActivityHeatmap = async (userId) => {
    try {
        // Fetch last 365 days or all data
        const activities = await Activity.find({ userId: String(userId) })
            .sort({ date: 1 })
            .select('date count -_id');

        return activities;
    } catch (error) {
        console.error('Error fetching heatmap:', error);
        throw error;
    }
};
