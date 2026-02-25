const mongoose = require('mongoose');
const { User, FacultyProfile, AdminProfile } = require('../models/pg');
const Faculty = require('../models/mongo/Faculty');
const { sequelize } = require('../config/database');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';

async function run() {
    try {
        // 1. Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 2. Connect to PostgreSQL
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL');

        const namesToDelete = ['Chhotu Sharma', 'Chhotu Singh'];

        // --- MongoDB Deletion ---
        console.log('\n--- MongoDB Deletion ---');
        const facults = await Faculty.find({ name: { $in: namesToDelete } });
        console.log('Found in MongoDB:', facults.map(f => ({ id: f._id, name: f.name, role: 'faculty' })));

        if (facults.length > 0) {
            const mongoResult = await Faculty.deleteMany({ name: { $in: namesToDelete } });
            console.log(`Deleted ${mongoResult.deletedCount} items from MongoDB.`);
        }

        // --- PostgreSQL Deletion ---
        console.log('\n--- PostgreSQL Deletion ---');
        const users = await User.findAll({
            where: {
                name: { [require('sequelize').Op.in]: namesToDelete }
            }
        });

        console.log('Found in PostgreSQL:', users.map(u => ({ id: u.id, name: u.name, role: u.role })));

        if (users.length > 0) {
            const userIds = users.map(u => u.id);

            // Delete associated profiles first (Cascading usually handles this but let's be safe)
            await FacultyProfile.destroy({ where: { userId: userIds } });
            await AdminProfile.destroy({ where: { userId: userIds } });

            // Delete Users
            const pgResult = await User.destroy({ where: { id: userIds } });
            console.log(`Deleted ${pgResult} users from PostgreSQL.`);
        } else {
            console.log('No users found in PostgreSQL with these names.');
        }

        console.log('\n🎉 Deletion Complete!');

    } catch (err) {
        console.error('❌ Error during deletion:', err);
    } finally {
        await mongoose.connection.close();
        if (sequelize) await sequelize.close();
        process.exit(0);
    }
}

run();
