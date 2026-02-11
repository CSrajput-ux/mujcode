// Quick fix script to update semester values from 3,5,7 to 1 or 2
const { sequelize } = require('../config/database');

async function fixSemesterValues() {
    try {
        console.log('Fixing semester values to be 1 or 2 only...');

        // Update all semesters > 2 to semester 1
        await sequelize.query(`
            UPDATE "StudentProfiles"
            SET "semester" = 1
            WHERE "semester" > 2
        `);

        const [results] = await sequelize.query(`
            SELECT COUNT(*) as count FROM "StudentProfiles" WHERE "semester" IS NOT NULL
        `);

        console.log(`✓ Updated ${results[0].count} student records`);
        console.log('All semester values are now 1 or 2');

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        await sequelize.close();
        process.exit(1);
    }
}

fixSemesterValues();
