const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { StudentProfile } = require('../models/pg');

async function resetProfiles() {
    try {
        console.log('Starting reset of student academic profiles...');

        // Update all student profiles to reset section, year, and semester
        const [updatedCount] = await StudentProfile.update(
            {
                section: '---',
                year: null,
                semester: null
            },
            {
                where: {}, // Update all records
            }
        );

        console.log(`Successfully reset ${updatedCount} student profiles.`);
        process.exit(0);
    } catch (error) {
        console.error('Error resetting profiles:', error);
        process.exit(1);
    }
}

resetProfiles();
