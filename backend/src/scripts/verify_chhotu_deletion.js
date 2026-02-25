const mongoose = require('mongoose');
const { User } = require('../models/pg');
const Faculty = require('../models/mongo/Faculty');
const { sequelize } = require('../config/database');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';

async function verify() {
    try {
        await mongoose.connect(MONGO_URI);
        const mCount = await Faculty.countDocuments({ name: { $in: ['Chhotu Sharma', 'Chhotu Singh'] } });

        await sequelize.authenticate();
        const pCount = await User.count({
            where: {
                name: { [require('sequelize').Op.in]: ['Chhotu Sharma', 'Chhotu Singh'] }
            }
        });

        console.log('--- Final Verification ---');
        console.log('MongoDB (Faculty):', mCount === 0 ? '✅ Deleted' : '❌ Still Exists');
        console.log('PostgreSQL (User):', pCount === 0 ? '✅ Deleted' : '❌ Still Exists');

    } catch (err) {
        console.error('Error during verification:', err);
    } finally {
        await mongoose.connection.close();
        if (sequelize) await sequelize.close();
        process.exit(0);
    }
}

verify();
