const { Department } = require('../models/pg/UniversityStructure');
const { sequelize } = require('../config/database');

async function check() {
    try {
        await sequelize.authenticate();
        console.log('DB Connected');

        const total = await Department.count();
        console.log(`Total Departments: ${total}`);

        if (total === 0) {
            console.log('No departments found.');
            return;
        }

        const distinctFaculties = await Department.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('facultyName')), 'facultyName']],
            raw: true
        });

        console.log('Distinct Faculty Names:', distinctFaculties);

        const nulls = await Department.findAll({
            where: { facultyName: null },
            attributes: ['id', 'name']
        });

        console.log(`Departments with NULL facultyName: ${nulls.length}`);
        if (nulls.length > 0) {
            console.log('Sample NULL deps:', nulls.slice(0, 3).map(d => d.name));
        }

    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}
check();
