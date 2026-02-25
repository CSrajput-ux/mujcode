const mongoose = require('mongoose');
const { User, FacultyProfile, AdminProfile } = require('../models/pg');
const { sequelize } = require('../config/database');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';

async function run() {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;
        const namesToDelete = ['Chhotu Sharma', 'Chhotu Singh'];
        const regex = /Chhotu/i;

        console.log('--- Searching MongoDB Collections ---');
        const collections = await db.listCollections().toArray();
        for (const colInfo of collections) {
            const col = db.collection(colInfo.name);
            const docs = await col.find({
                $or: [
                    { name: regex },
                    { email: regex },
                    { fullname: regex }
                ]
            }).toArray();

            if (docs.length > 0) {
                console.log(`\nCollection: ${colInfo.name}`);
                console.log(JSON.stringify(docs.map(d => ({ id: d._id, name: d.name || d.fullname, email: d.email })), null, 2));

                // Delete them
                await col.deleteMany({
                    $or: [
                        { name: { $in: namesToDelete } },
                        { fullname: { $in: namesToDelete } }
                    ]
                });
                console.log(`✅ Deleted matches from ${colInfo.name}`);
            }
        }

        console.log('\n--- Searching PostgreSQL Users ---');
        await sequelize.authenticate();
        const users = await User.findAll({
            where: {
                name: { [require('sequelize').Op.iLike]: '%Chhotu%' }
            }
        });

        if (users.length > 0) {
            console.log('Found in Postgres:', users.map(u => ({ id: u.id, name: u.name, role: u.role })));
            const userIds = users.filter(u => namesToDelete.includes(u.name)).map(u => u.id);

            if (userIds.length > 0) {
                await FacultyProfile.destroy({ where: { userId: userIds } });
                await AdminProfile.destroy({ where: { userId: userIds } });
                await User.destroy({ where: { id: userIds } });
                console.log(`✅ Deleted exact name matches from PostgreSQL.`);
            }
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.connection.close();
        if (sequelize) await sequelize.close();
        process.exit(0);
    }
}

run();
