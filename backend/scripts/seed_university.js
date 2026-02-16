require('dotenv').config({ path: '../.env' }); // Adjusted path for script execution from root or scripts/
const { sequelize } = require('../src/config/database');
const { Department, Program, Branch, Section, AcademicYear } = require('../src/models/pg/UniversityStructure');
const MUJ_STRUCTURE = require('../src/data/muj_structure');

// Mappings for Dept -> Programs
const DEPT_PROGRAM_MAP = {
    "Computer Science and Engineering (CSE)": ["B.Tech", "M.Tech", "PhD"],
    "Information Technology (IT)": ["B.Tech", "M.Tech", "PhD"],
    "Computer and Communication Engineering (CCE)": ["B.Tech", "M.Tech"],
    "Electronics and Communication Engineering (ECE)": ["B.Tech", "M.Tech", "PhD"],
    "Electrical and Electronics Engineering (EEE)": ["B.Tech", "M.Tech", "PhD"],
    "Mechanical Engineering (ME)": ["B.Tech", "M.Tech", "PhD"],
    "Civil Engineering (CE)": ["B.Tech", "M.Tech", "PhD"],
    "Automobile Engineering": ["B.Tech"],
    "Mechatronics Engineering": ["B.Tech"],
    "Chemical Engineering": ["B.Tech"],
    "Data Science and Engineering": ["B.Tech", "M.Tech"],
    "Computer Applications": ["BCA", "MCA", "PhD"],
    "Business Administration": ["BBA", "MBA", "PhD"],
    "Commerce": ["B.Com", "M.Com", "PhD"],
    "Hotel Management": ["BHM"],
    "Journalism and Mass Communication": ["BA (J&MC)", "MA (J&MC)"],
    "Psychology": ["BA", "MA", "PhD"],
    "Economics": ["BA", "MA", "PhD"],
    "Mathematics and Statistics": ["B.Sc", "M.Sc", "PhD"],
    "Physics": ["B.Sc", "M.Sc", "PhD"],
    "Chemistry": ["B.Sc", "M.Sc", "PhD"],
    "Biosciences": ["B.Sc", "M.Sc", "PhD"],
    "Law": ["LLB", "LLM", "BA LLB", "BBA LLB"],
    "Architecture": ["B.Arch", "M.Arch"],
    "Design": ["B.Des", "M.Des"],
    "Fashion Design": ["B.Des"],
    "Interior Design": ["B.Des"]
};

// Default Branches if not in MUJ_STRUCTURE.branches
const DEFAULT_BRANCHES = {
    "BCA": ["BCA"],
    "MCA": ["MCA"],
    "BBA": ["BBA"],
    "MBA": ["MBA - HR", "MBA - Finance", "MBA - Marketing"],
    "B.Com": ["B.Com"],
    "M.Com": ["M.Com"],
    "LLB": ["LLB"],
    "B.Arch": ["B.Arch"],
    "B.Des": ["B.Des"]
};

async function seedUniversity() {
    try {
        console.log("🔄 Connecting to Database...");
        await sequelize.authenticate();
        console.log("✅ Database Connected.");

        // 1. Seed Academic Years
        console.log("📅 Seeding Academic Years...");
        const years = ["2023-2024", "2024-2025", "2025-2026"];
        let currentYearId;
        for (const year of years) {
            const isCurrent = year === "2024-2025";
            const [y] = await AcademicYear.findOrCreate({
                where: { name: year },
                defaults: { isCurrent }
            });
            if (isCurrent) currentYearId = y.id;
        }

        // 2. Seed Departments
        console.log("🏢 Seeding Departments -> Programs -> Branches -> Sections...");

        for (const deptName of MUJ_STRUCTURE.departments) {
            // Create Department
            const [dept] = await Department.findOrCreate({
                where: { name: deptName },
                defaults: {
                    code: deptName.split('(')[1]?.replace(')', '') || deptName.substring(0, 3).toUpperCase(),
                    facultyName: "FoE" // Simplified for now (Faculty of Engineering/etc)
                }
            });

            // Determine Programs
            const programNames = DEPT_PROGRAM_MAP[deptName] || ["General"];

            for (const progName of programNames) {
                // Create Program
                const [prog] = await Program.findOrCreate({
                    where: { name: progName, departmentId: dept.id },
                    defaults: { durationYears: 3 } // Default
                });

                // Determine Branches
                let branchNames = [];
                // Check if Engineering Tech Branch
                if (progName === "B.Tech" && MUJ_STRUCTURE.branches[deptName]) {
                    branchNames = MUJ_STRUCTURE.branches[deptName];
                } else {
                    // Use Defaults or Self
                    branchNames = DEFAULT_BRANCHES[progName] || [progName];
                }

                for (const branchName of branchNames) {
                    // Create Branch
                    const [branch] = await Branch.findOrCreate({
                        where: { name: branchName, programId: prog.id },
                        defaults: { code: branchName }
                    });

                    // Create Sections
                    // Only create sections for B.Tech/BCA/MCA/BBA/MBA mostly
                    if (["B.Tech", "BCA", "BBA", "MCA", "MBA"].includes(progName)) {
                        const sections = ["A", "B", "C", "D"]; // Reduced set for seed
                        for (const secName of sections) {
                            await Section.findOrCreate({
                                where: { name: secName, branchId: branch.id },
                                defaults: {
                                    currentSemester: 1,
                                    academicYearId: currentYearId
                                }
                            });
                        }
                    }
                }
            }
        }

        console.log("✅ University Structure Seeded Successfully!");

    } catch (error) {
        console.error("❌ Seeding Failed:", error);
    } finally {
        await sequelize.close();
    }
}

seedUniversity();
