const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { User, FacultyProfile } = require('../models/pg');

async function checkFacultyLogin() {
    try {
        let output = '--- Faculty Login Status Check ---\n';

        const faculties = await User.findAll({
            where: { role: 'faculty' },
            include: [{ model: FacultyProfile }]
        });

        output += `Total Faculty Users found: ${faculties.length}\n`;

        const issues = [];
        faculties.forEach(f => {
            if (!f.FacultyProfile) {
                issues.push(`Faculty ${f.email} has NO profile.`);
            }
            if (!f.password) {
                issues.push(`Faculty ${f.email} has NO password set.`);
            }
        });

        if (issues.length === 0) {
            output += '✅ All faculty users have basic profiles and passwords.\n';
        } else {
            output += '❌ Issues found:\n';
            issues.forEach(issue => output += ` - ${issue}\n`);
        }

        // List first 5 for sample
        output += '\nSample Faculty Accounts:\n';
        faculties.slice(0, 20).forEach(f => {
            output += `- ${f.email} (Profile: ${f.FacultyProfile ? 'Yes' : 'No'})\n`;
        });

        fs.writeFileSync('faculty_check.log', output);
        console.log('Results written to faculty_check.log');
        process.exit(0);
    } catch (error) {
        console.error('Error checking faculty login:', error);
        process.exit(1);
    }
}

checkFacultyLogin();
