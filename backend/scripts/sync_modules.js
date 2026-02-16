<<<<<<< HEAD
const { sequelize } = require('../src/config/database');
const { Company, PlacementDrive, JobPosting, StudentApplication } = require('../src/models/pg/PlacementModule');
const { AdministrativeRole, RoleAssignment } = require('../src/models/pg/AdminModule');
require('dotenv').config({ path: '../.env' });

const syncModules = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB');

        console.log('🔄 Syncing Placement Module...');
        await Company.sync();
        await PlacementDrive.sync();
        await JobPosting.sync();
        await StudentApplication.sync();

        console.log('🔄 Syncing Admin Module...');
        await AdministrativeRole.sync();
        await RoleAssignment.sync();

        console.log('\n✅ All modules synced successfully!');

    } catch (error) {
        console.error("❌ Sync failed:", error);
    } finally {
        await sequelize.close();
    }
};

syncModules();
=======
const { sequelize } = require('../src/config/database');
const { Company, PlacementDrive, JobPosting, StudentApplication } = require('../src/models/pg/PlacementModule');
const { AdministrativeRole, RoleAssignment } = require('../src/models/pg/AdminModule');
require('dotenv').config({ path: '../.env' });

const syncModules = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB');

        console.log('🔄 Syncing Placement Module...');
        await Company.sync();
        await PlacementDrive.sync();
        await JobPosting.sync();
        await StudentApplication.sync();

        console.log('🔄 Syncing Admin Module...');
        await AdministrativeRole.sync();
        await RoleAssignment.sync();

        console.log('\n✅ All modules synced successfully!');

    } catch (error) {
        console.error("❌ Sync failed:", error);
    } finally {
        await sequelize.close();
    }
};

syncModules();
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
