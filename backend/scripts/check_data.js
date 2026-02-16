const { Department } = require('../src/models/pg/UniversityStructure');
const { sequelize } = require('../src/config/database');

const checkData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected.');

        const departments = await Department.findAll();
        console.log(`Total Departments: ${departments.length}`);

        const distinctFaculties = [...new Set(departments.map(d => d.facultyName))];
        console.log('Distinct Faculties (Schools):', distinctFaculties);

        // logs details
        if (departments.length > 0) {
            console.log('Sample Dept:', departments[0].toJSON());
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

checkData();
