<<<<<<< HEAD
const { sequelize } = require('../src/config/database');
const StudentProfile = require('../src/models/pg/StudentProfile');
const { StudentEnrollment } = require('../src/models/pg/UniversityAssociations');
const { Section, Branch, Subject, Program, Department } = require('../src/models/pg/UniversityStructure');
require('dotenv').config({ path: '../.env' });

const verifyStudentSubjects = async () => {
    try {
        await sequelize.authenticate();

        // 1. Get a random student
        const student = await StudentProfile.findOne();
        if (!student) throw new Error("No students found");

        console.log(`👨‍🎓 Checking Subjects for Student: ${student.userId}`);

        // 2. Get Enrollment
        const enrollment = await StudentEnrollment.findOne({
            where: { studentId: student.userId, status: 'Active' },
            include: [
                {
                    model: Section,
                    include: [
                        {
                            model: Branch,
                            include: [
                                { model: Program, include: [Department] }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!enrollment) {
            console.log("❌ Student has no active enrollment.");
            return;
        }

        const section = enrollment.Section;
        const branch = section.Branch;
        const program = branch.Program;
        const dept = program.Department;

        console.log(`   🏫 Enrolled in: ${dept.name} > ${program.name} > ${branch.name}`);
        console.log(`   📍 Section: ${section.name}`);
        console.log(`   📅 Current Semester: ${section.currentSemester}`); // This is Section's current sem

        // 3. Fetch Subjects for this Branch + Semester
        // Note: Realistically, we might check what semester the STUDENT is in, 
        // but for now let's assume section's semester or student's semester.
        // Let's use the explicit semester from StudentProfile or Section.
        // StudentProfile has 'semester'.

        const currentSemester = student.semester || section.currentSemester || 1;
        console.log(`   📖 Fetching subjects for Semester ${currentSemester}...`);

        const subjects = await Subject.findAll({
            where: {
                branchId: branch.id,
                semester: currentSemester
            }
        });

        if (subjects.length > 0) {
            console.log("\n📚 Subjects List:");
            subjects.forEach(sub => {
                console.log(`   - ${sub.code}: ${sub.name} (${sub.credits} credits)`);
            });
        } else {
            console.log("⚠️ No subjects found for this semester.");
        }

    } catch (error) {
        console.error("❌ Verification failed:", error);
    } finally {
        await sequelize.close();
    }
};

verifyStudentSubjects();
=======
const { sequelize } = require('../src/config/database');
const StudentProfile = require('../src/models/pg/StudentProfile');
const { StudentEnrollment } = require('../src/models/pg/UniversityAssociations');
const { Section, Branch, Subject, Program, Department } = require('../src/models/pg/UniversityStructure');
require('dotenv').config({ path: '../.env' });

const verifyStudentSubjects = async () => {
    try {
        await sequelize.authenticate();

        // 1. Get a random student
        const student = await StudentProfile.findOne();
        if (!student) throw new Error("No students found");

        console.log(`👨‍🎓 Checking Subjects for Student: ${student.userId}`);

        // 2. Get Enrollment
        const enrollment = await StudentEnrollment.findOne({
            where: { studentId: student.userId, status: 'Active' },
            include: [
                {
                    model: Section,
                    include: [
                        {
                            model: Branch,
                            include: [
                                { model: Program, include: [Department] }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!enrollment) {
            console.log("❌ Student has no active enrollment.");
            return;
        }

        const section = enrollment.Section;
        const branch = section.Branch;
        const program = branch.Program;
        const dept = program.Department;

        console.log(`   🏫 Enrolled in: ${dept.name} > ${program.name} > ${branch.name}`);
        console.log(`   📍 Section: ${section.name}`);
        console.log(`   📅 Current Semester: ${section.currentSemester}`); // This is Section's current sem

        // 3. Fetch Subjects for this Branch + Semester
        // Note: Realistically, we might check what semester the STUDENT is in, 
        // but for now let's assume section's semester or student's semester.
        // Let's use the explicit semester from StudentProfile or Section.
        // StudentProfile has 'semester'.

        const currentSemester = student.semester || section.currentSemester || 1;
        console.log(`   📖 Fetching subjects for Semester ${currentSemester}...`);

        const subjects = await Subject.findAll({
            where: {
                branchId: branch.id,
                semester: currentSemester
            }
        });

        if (subjects.length > 0) {
            console.log("\n📚 Subjects List:");
            subjects.forEach(sub => {
                console.log(`   - ${sub.code}: ${sub.name} (${sub.credits} credits)`);
            });
        } else {
            console.log("⚠️ No subjects found for this semester.");
        }

    } catch (error) {
        console.error("❌ Verification failed:", error);
    } finally {
        await sequelize.close();
    }
};

verifyStudentSubjects();
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
