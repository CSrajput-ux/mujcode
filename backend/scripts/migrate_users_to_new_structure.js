const { sequelize } = require('../src/config/database');
const StudentProfile = require('../src/models/pg/StudentProfile');
const { Branch, Section, AcademicYear } = require('../src/models/pg/UniversityStructure');
const { StudentEnrollment } = require('../src/models/pg/UniversityAssociations');
require('dotenv').config({ path: '../.env' });

const migrateUsers = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB');

        // Sync Association Table
        await StudentEnrollment.sync({ force: true });
        console.log("🔄 Synced StudentEnrollment Table");

        // 1. Get Current Academic Year
        const currentYear = await AcademicYear.findOne({ where: { isCurrent: true } });
        if (!currentYear) {
            throw new Error("No Current Academic Year found!");
        }

        // 2. Fetch all students
        const students = await StudentProfile.findAll();
        console.log(`👨‍🎓 Found ${students.length} students to migrate.`);

        let successCount = 0;
        let failCount = 0;

        for (const student of students) {
            try {
                // Map String Branch to DB Branch
                let branchCode = student.branch;
                if (!branchCode || branchCode === 'Unknown') {
                    branchCode = 'CSE';
                }

                const sectionName = student.section || 'A'; // Default if missing

                const branch = await Branch.findOne({ where: { code: branchCode } });
                if (!branch) {
                    console.warn(`⚠️ Branch not found for student ${student.userId} (${branchCode})`);
                    failCount++;
                    continue;
                }

                const section = await Section.findOne({
                    where: {
                        name: sectionName,
                        branchId: branch.id,
                        academicYearId: currentYear.id
                    }
                });

                if (!section) {
                    console.warn(`⚠️ Section not found for student ${student.userId} (${branchCode} - ${sectionName})`);
                    failCount++;
                    continue;
                }

                // Create Enrollment
                await StudentEnrollment.create({
                    studentId: student.userId,
                    sectionId: section.id,
                    academicYearId: currentYear.id,
                    status: 'Active'
                });

                successCount++;
            } catch (err) {
                console.error(`❌ Error migrating student ${student.userId}:`, err.message);
                failCount++;
            }
        }

        console.log(`\n✅ Migration Complete!`);
        console.log(`   Success: ${successCount}`);
        console.log(`   Failed: ${failCount}`);

    } catch (error) {
        console.error("❌ Migration failed:", error);
    } finally {
        await sequelize.close();
    }
};

migrateUsers();
