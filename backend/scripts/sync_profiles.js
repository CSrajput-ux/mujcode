const { sequelize } = require('../src/config/database');
const StudentProfile = require('../src/models/pg/StudentProfile');
const FacultyProfile = require('../src/models/pg/FacultyProfile');

const syncProfiles = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB');

        console.log('🔄 Syncing StudentProfile...');
        await StudentProfile.sync({ alter: true });

        console.log('🔄 Syncing FacultyProfile...');
        await FacultyProfile.sync({ alter: true });

        console.log('✅ Profile tables synced successfully.');
    } catch (error) {
        console.error('❌ Sync Error:', error);
    } finally {
        await sequelize.close();
    }
};

syncProfiles();
