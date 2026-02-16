<<<<<<< HEAD
const { sequelize } = require('../src/config/database');
const { AdministrativeRole } = require('../src/models/pg/AdminModule');
require('dotenv').config({ path: '../.env' });

const seedRoles = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB');

        const roles = [
            { name: 'Dean', permissions: { canViewAllDepts: true, canApproveCurriculum: true } },
            { name: 'HOD', permissions: { canViewDept: true, canAssignFaculty: true } },
            { name: 'PlacementOfficer', permissions: { canManageDrives: true, canViewApplications: true } },
            { name: 'ExamCell', permissions: { canManageExams: true, canPublishResults: true } }
        ];

        for (const role of roles) {
            await AdministrativeRole.findOrCreate({
                where: { name: role.name },
                defaults: { permissions: role.permissions }
            });
            console.log(`✅ Role Created/Verified: ${role.name}`);
        }

    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        await sequelize.close();
    }
};

seedRoles();
=======
const { sequelize } = require('../src/config/database');
const { AdministrativeRole } = require('../src/models/pg/AdminModule');
require('dotenv').config({ path: '../.env' });

const seedRoles = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB');

        const roles = [
            { name: 'Dean', permissions: { canViewAllDepts: true, canApproveCurriculum: true } },
            { name: 'HOD', permissions: { canViewDept: true, canAssignFaculty: true } },
            { name: 'PlacementOfficer', permissions: { canManageDrives: true, canViewApplications: true } },
            { name: 'ExamCell', permissions: { canManageExams: true, canPublishResults: true } }
        ];

        for (const role of roles) {
            await AdministrativeRole.findOrCreate({
                where: { name: role.name },
                defaults: { permissions: role.permissions }
            });
            console.log(`✅ Role Created/Verified: ${role.name}`);
        }

    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        await sequelize.close();
    }
};

seedRoles();
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
