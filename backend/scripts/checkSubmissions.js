const mongoose = require('mongoose');
const Submission = require('./src/models/mongo/Submission');
const path = require('path');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';

const checkSubmissions = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const userId = "2427030521"; // From screenshot
        // Try both string and number query just in case
        const submissionsString = await Submission.find({ userId: userId });
        const submissionsNumber = await Submission.find({ userId: parseInt(userId) });

        console.log(`Found ${submissionsString.length} submissions (String ID)`);
        console.log(`Found ${submissionsNumber.length} submissions (Number ID)`);

        if (submissionsString.length > 0) {
            console.log('Sample (String):', submissionsString[0]);
        }
        if (submissionsNumber.length > 0) {
            console.log('Sample (Number):', submissionsNumber[0]);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
};

checkSubmissions();
