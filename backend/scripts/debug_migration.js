const { sequelize } = require('../src/config/database');
const StudentProfile = require('../src/models/pg/StudentProfile');
const { Branch } = require('../src/models/pg/UniversityStructure');
require('dotenv').config({ path: '../.env' });

const debugParams = async () => {
    try {
        await sequelize.authenticate();

        const branches = await Branch.findAll();
        console.log("Existing Branches:", branches.map(b => `${b.name} (${b.code})`));

        const students = await StudentProfile.findAll({ limit: 5 });
        console.log("Sample Students:", students.map(s => `User ${s.userId}: Branch='${s.branch}', Section='${s.section}'`));

    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
};

debugParams();
