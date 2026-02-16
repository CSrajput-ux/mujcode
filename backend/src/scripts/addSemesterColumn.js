// Migration script to add semester column to StudentProfiles table
const { sequelize } = require('../config/database');
const StudentProfile = require('../models/pg/StudentProfile');

async function addSemesterColumn() {
    try {
        console.log('='.repeat(60));
        console.log('Database Migration: Add Semester Column');
        console.log('='.repeat(60));
        console.log('\nStarting migration...');

        // Sync the StudentProfile model to update table schema
        // alter: true will add new columns without dropping existing data
        await StudentProfile.sync({ alter: true });

        console.log('\n✓ Successfully added semester column to StudentProfiles table');
        console.log('  - Column name: semester');
        console.log('  - Column type: INTEGER');
        console.log('  - Nullable: true');
        console.log('  - Values: 1-8 (representing semester 1 to semester 8)');

        // Update existing records with semester 1 or 2 (since year already specifies which academic year)
        console.log('\nUpdating existing student records...');

        await sequelize.query(`
            UPDATE "StudentProfiles"
            SET "semester" = 1
            WHERE "semester" IS NULL
        `);

        const [results] = await sequelize.query(`
            SELECT COUNT(*) as count FROM "StudentProfiles" WHERE "semester" IS NOT NULL
        `);

        console.log(`✓ Updated ${results[0].count} student records with semester values`);
        console.log('\n' + '='.repeat(60));
        console.log('Migration completed successfully!');
        console.log('='.repeat(60));

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('\n✗ Migration failed:', error.message);
        console.error(error);
        await sequelize.close();
        process.exit(1);
    }
}

// Run migration
addSemesterColumn();
