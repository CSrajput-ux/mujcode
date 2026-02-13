const mongoose = require('mongoose');
const Activity = require('./src/models/mongo/Activity');
const StudentProgress = require('./src/models/mongo/StudentProgress');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const activities = await Activity.find({});
        console.log('--- ACTIVITIES ---');
        console.log(JSON.stringify(activities, null, 2));

        const progress = await StudentProgress.find({});
        console.log('--- STUDENT PROGRESS ---');
        console.log(JSON.stringify(progress, null, 2));

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

run();
