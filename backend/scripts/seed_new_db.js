const { sequelize } = require('../src/config/database');
const { Department, Program, Branch, Subject, AcademicYear, Section } = require('../src/models/pg/UniversityStructure');
const MUJ_REAL_DATA = require('../src/data/muj_real_data');
require('dotenv').config({ path: '../.env' });

const seedNewDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB');

        // DROP TABLES IN REVERSE ORDER TO HANDLE FOREIGN KEYS
        await Section.drop();
        await Subject.drop();
        await Branch.drop();
        await Program.drop();
        await Department.drop();
        await AcademicYear.drop();

        // Ensure tables exist
        await Department.sync({ force: true });
        await Program.sync({ force: true });
        await Branch.sync({ force: true });
        await Subject.sync({ force: true });
        await AcademicYear.sync({ force: true });
        await Section.sync({ force: true });

        // 1. Create Academic Year
        const [year, created] = await AcademicYear.findOrCreate({
            where: { name: '2025-2026' },
            defaults: { isCurrent: true }
        });
        console.log(`📅 Academic Year: ${year.name}`);

        // 2. Iterate Faculties (we only modeled Dept/Prog/Branch for now, Faculty is a grouping)
        for (const faculty of MUJ_REAL_DATA.faculties) {
            console.log(`\n🏛️  Processing Faculty: ${faculty.name}`);

            for (const deptData of faculty.departments) {
                const [dept] = await Department.findOrCreate({
                    where: { code: deptData.code },
                    defaults: { name: deptData.name, facultyName: faculty.name }
                });
                console.log(`  └─ 🏢 Department: ${dept.code}`);

                for (const progData of deptData.programs) {
                    const [prog] = await Program.findOrCreate({
                        where: { name: progData.name, departmentId: dept.id },
                        defaults: { durationYears: progData.duration }
                    });
                    console.log(`     └─ 🎓 Program: ${prog.name}`);

                    for (const branchData of progData.branches) {
                        const [branch] = await Branch.findOrCreate({
                            where: { code: branchData.code, programId: prog.id },
                            defaults: { name: branchData.name }
                        });
                        console.log(`        └─ 🌿 Branch: ${branch.code}`);

                        // Create Default Sections (A, B) for this Branch
                        // In a real system, this depends on intake.
                        await Section.findOrCreate({
                            where: { name: 'A', branchId: branch.id, academicYearId: year.id },
                            defaults: { currentSemester: 1 }
                        });
                        await Section.findOrCreate({
                            where: { name: 'B', branchId: branch.id, academicYearId: year.id },
                            defaults: { currentSemester: 1 }
                        });


                        // Process Curriculum (Subjects)
                        if (branchData.curriculum) {
                            for (const [sem, subjects] of Object.entries(branchData.curriculum)) {
                                for (const subjectName of subjects) {
                                    await Subject.findOrCreate({
                                        where: { name: subjectName, branchId: branch.id, semester: parseInt(sem) },
                                        defaults: { code: `SUB-${branch.code}-${sem}-${Math.floor(Math.random() * 1000)}` }
                                    });
                                }
                            }
                            console.log(`           └─ 📚 Added Subjects for ${Object.keys(branchData.curriculum).length} semesters`);
                        }
                    }
                }
            }
        }

        console.log("\n✅ Database Seeding Complete!");

    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        await sequelize.close();
    }
};

seedNewDB();
