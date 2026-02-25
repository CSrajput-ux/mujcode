const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { User } = require('../models/pg');
const bcrypt = require('bcryptjs');

async function fixFacultyPassword() {
    try {
        console.log('--- Fixing Faculty Password: Aditya Sinha ---');

        // Search with flexible name/email
        const users = await User.findAll({
            where: {
                role: 'faculty'
            }
        });

        const target = users.find(u =>
            u.name.toLowerCase().includes('aditya') ||
            u.name.toLowerCase().includes('aditiya') ||
            u.email.toLowerCase().includes('aditya') ||
            u.email.toLowerCase().includes('aditiya')
        );

        if (!target) {
            console.log('❌ User not found with variations of "Aditya Sinha"');
            process.exit(1);
        }

        console.log(`Found User: ${target.name} (${target.email})`);

        const DEFAULT_PASSWORD = 'Faculty@123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);

        target.password = hashedPassword;
        await target.save();

        console.log(`✅ Password successfully reset to: ${DEFAULT_PASSWORD}`);
        process.exit(0);
    } catch (error) {
        console.error('Error fixing password:', error);
        process.exit(1);
    }
}

fixFacultyPassword();
