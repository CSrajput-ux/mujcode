const mongoose = require('mongoose');
const pg = require('../models/pg');
const StudentProgress = require('../models/mongo/StudentProgress');
const Faculty = require('../models/mongo/Faculty');
const MentorRequest = require('../models/mongo/MentorRequest');
const { sequelize } = require('../config/database');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';

async function run() {
    try {
        // 1. Connect to Databases
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL');

        const namesToDelete = ['Chhotu Sharma', 'Chhotu Singh'];
        const regex = /Chhotu/i;

        // 2. Find IDs and Emails from PostgreSQL
        const users = await pg.User.findAll({
            where: {
                name: { [require('sequelize').Op.in]: namesToDelete }
            },
            raw: true
        });

        if (users.length === 0) {
            console.log('⚠️ No users found with these names in PostgreSQL.');
        } else {
            const userIds = users.map(u => u.id);
            const emails = users.map(u => u.email);
            console.log(`🔍 Found ${users.length} users:`, users.map(u => ({ id: u.id, name: u.name, role: u.role })));

            // 3. Delete from MongoDB
            console.log('\n--- MongoDB Cleanup ---');

            const mongoModels = [
                { model: StudentProgress, field: 'userId' },
                { model: Faculty, field: 'userId' },
                { model: MentorRequest, field: 'studentId' },
                { model: MentorRequest, field: 'facultyId' }
            ];

            for (const item of mongoModels) {
                if (item.model) {
                    const res = await item.model.deleteMany({ [item.field]: { $in: userIds } });
                    if (res.deletedCount > 0) {
                        console.log(`✅ Deleted ${res.deletedCount} from ${item.model.modelName} by ${item.field}`);
                    }
                }
            }

            // Universal delete by name/email/ID in all collections
            const db = mongoose.connection.db;
            const collections = await db.listCollections().toArray();
            for (const colInfo of collections) {
                const col = db.collection(colInfo.name);
                const res = await col.deleteMany({
                    $or: [
                        { userId: { $in: userIds } },
                        { studentId: { $in: userIds } },
                        { facultyId: { $in: userIds } },
                        { name: { $in: namesToDelete } },
                        { email: { $in: emails } },
                        { fullname: { $in: namesToDelete } }
                    ]
                });
                if (res.deletedCount > 0) {
                    console.log(`✅ Deleted ${res.deletedCount} items from generic scan of: ${colInfo.name}`);
                }
            }

            // 4. Delete from PostgreSQL
            console.log('\n--- PostgreSQL Cleanup ---');

            const pgDeletions = [
                { model: pg.RoleAssignment, field: 'userId' },
                { model: pg.StudentEnrollment, field: 'studentId' },
                { model: pg.FacultyAllocation, field: 'facultyId' },
                { model: pg.StudentProfile, field: 'userId' },
                { model: pg.FacultyProfile, field: 'userId' },
                { model: pg.AdminProfile, field: 'userId' },
                { model: pg.CompanyProfile, field: 'userId' }
            ];

            for (const item of pgDeletions) {
                if (item.model) {
                    const count = await item.model.destroy({ where: { [item.field]: userIds } });
                    if (count > 0) {
                        console.log(`✅ Deleted ${count} records from ${item.model.name}`);
                    }
                }
            }

            // Final User deletion
            const finalCount = await pg.User.destroy({ where: { id: userIds } });
            console.log(`🚀 Final Deletion: ${finalCount} users removed from PostgreSQL.`);
        }

        console.log('\n🎉 Mission Accomplished: Profiles purged.');

    } catch (err) {
        console.error('❌ Critical Error:', err);
    } finally {
        await mongoose.connection.close();
        if (sequelize) await sequelize.close();
        process.exit(0);
    }
}

run();
