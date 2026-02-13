const { sequelize } = require('../src/config/database');
const { Department, Program, Branch, Subject } = require('../src/models/pg/UniversityStructure');
const { StudentEnrollment } = require('../src/models/pg/UniversityAssociations');
require('dotenv').config({ path: '../.env' });

const testModels = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection has been established successfully.');

        // Sync new models (force: true to Drop tables if exist - BE CAREFUL IN PROD)
        // For development/redesign, we want to start fresh with these tables.
        await Department.sync({ force: true });
        await Program.sync({ force: true });
        await Branch.sync({ force: true });
        await Subject.sync({ force: true });
        // await StudentEnrollment.sync({ force: true }); // Dependencies on User/Section

        console.log("✅ New University Models synced successfully.");
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
};

testModels();
