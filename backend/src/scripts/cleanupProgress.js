const mongoose = require('mongoose');
const StudentProgress = require('../models/mongo/StudentProgress');
require('dotenv').config();

const checkData = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const allProgress = await StudentProgress.find({});
        console.log(`Found ${allProgress.length} progress records.`);

        const badRecords = [];
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        for (const p of allProgress) {
            if (!uuidRegex.test(p.userId)) {
                console.log(`❌ Invalid UUID found: ${p.userId} (ID: ${p._id})`);
                badRecords.push(p._id);
            }
        }

        if (badRecords.length > 0) {
            console.log(`Found ${badRecords.length} bad records. Deleting...`);
            await StudentProgress.deleteMany({ _id: { $in: badRecords } });
            console.log('✅ Deleted bad records.');
        } else {
            console.log('✅ All records look valid.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkData();
