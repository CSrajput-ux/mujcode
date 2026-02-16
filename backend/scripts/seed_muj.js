<<<<<<< HEAD
// File: seed_muj.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../src/config/database');
const User = require('../src/models/pg/User');
const StudentProfile = require('../src/models/pg/StudentProfile');
const FacultyProfile = require('../src/models/pg/FacultyProfile');
const MUJ_STRUCTURE = require('../src/data/muj_structure');

// Helper to pick random item from array
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seedMUJ() {
    try {
        console.log("🔄 Connecting to Database...");
        await sequelize.authenticate();
        await sequelize.sync({ alter: true }); // Ensure schema matches models

        console.log("🏫 Seeding Manipal University Jaipur Data...");

        const usersData = [];
        const passwordHash = await bcrypt.hash("password123", 10);

        // 1. Create Students for various branches
        // We'll focus on B.Tech branches as they are most common
        const techBranches = ["CSE", "IT", "CCE", "ECE", "ME", "CE"];

        console.log("   Creating Students...");
        for (const branch of techBranches) {
            // Create 3 students per branch in different years
            for (let i = 1; i <= 3; i++) {
                const year = random([1, 2, 3, 4]);
                const semester = (year * 2) - random([0, 1]); // Simple sem logic
                const section = random(MUJ_STRUCTURE.sections);
                const rollNo = `24${branch}${year}${Math.floor(Math.random() * 1000)}`;
                const email = `student.${branch.toLowerCase()}.${rollNo}@muj.manipal.edu`;

                usersData.push({
                    email,
                    password: passwordHash,
                    name: `Student ${branch} ${i}`,
                    role: 'student',
                    isApproved: true,
                    isActive: true,
                    profile: {
                        rollNumber: rollNo,
                        branch: branch,
                        section: section,
                        year: year,
                        semester: semester,
                        course: "B.Tech",
                        department: `${branch} Department`
                    }
                });
            }
        }

        // Add a specific known student for testing
        usersData.push({
            email: "arjun.cse@muj.manipal.edu",
            password: passwordHash,
            name: "Arjun Verma",
            role: "student",
            isApproved: true,
            isActive: true,
            profile: {
                rollNumber: "219301123",
                branch: "CSE",
                section: "A",
                year: 3,
                semester: 5,
                course: "B.Tech",
                department: "Computer Science and Engineering (CSE)"
            }
        });

        // 2. Create Faculty
        console.log("   Creating Faculty...");
        const departments = Object.keys(MUJ_STRUCTURE.branches);
        for (const dept of departments) {
            // Create 1 faculty per department
            const shortDept = MUJ_STRUCTURE.branches[dept][0]; // approx
            const email = `faculty.${shortDept.toLowerCase()}@muj.manipal.edu`;

            usersData.push({
                email,
                password: passwordHash,
                name: `Dr. Faculty ${shortDept}`,
                role: 'faculty',
                isApproved: true,
                isActive: true,
                profile: {
                    employeeId: `FAC${shortDept}${Math.floor(Math.random() * 100)}`,
                    department: dept,
                    designation: "Assistant Professor"
                }
            });
        }

        // 3. Insert into Database
        for (const userData of usersData) {
            const { profile, ...userFields } = userData;

            // Check if user exists
            const existing = await User.findOne({ where: { email: userFields.email } });
            if (existing) {
                console.log(`   ⚠️ Skipped ${userFields.email} (Exists)`);
                continue;
            }

            const user = await User.create(userFields);

            if (userFields.role === 'student') {
                await StudentProfile.create({ ...profile, userId: user.id });
            } else if (userFields.role === 'faculty') {
                await FacultyProfile.create({ ...profile, userId: user.id });
            }
            console.log(`   ✅ Created ${userFields.role}: ${userFields.email}`);
        }

        console.log("\n🎉 MUJ Seeding Complete!");

    } catch (error) {
        console.error("❌ Error seeding MUJ data:", error);
    } finally {
        await sequelize.close();
    }
}

seedMUJ();
=======
// File: seed_muj.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../src/config/database');
const User = require('../src/models/pg/User');
const StudentProfile = require('../src/models/pg/StudentProfile');
const FacultyProfile = require('../src/models/pg/FacultyProfile');
const MUJ_STRUCTURE = require('../src/data/muj_structure');

// Helper to pick random item from array
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seedMUJ() {
    try {
        console.log("🔄 Connecting to Database...");
        await sequelize.authenticate();
        await sequelize.sync({ alter: true }); // Ensure schema matches models

        console.log("🏫 Seeding Manipal University Jaipur Data...");

        const usersData = [];
        const passwordHash = await bcrypt.hash("password123", 10);

        // 1. Create Students for various branches
        // We'll focus on B.Tech branches as they are most common
        const techBranches = ["CSE", "IT", "CCE", "ECE", "ME", "CE"];

        console.log("   Creating Students...");
        for (const branch of techBranches) {
            // Create 3 students per branch in different years
            for (let i = 1; i <= 3; i++) {
                const year = random([1, 2, 3, 4]);
                const semester = (year * 2) - random([0, 1]); // Simple sem logic
                const section = random(MUJ_STRUCTURE.sections);
                const rollNo = `24${branch}${year}${Math.floor(Math.random() * 1000)}`;
                const email = `student.${branch.toLowerCase()}.${rollNo}@muj.manipal.edu`;

                usersData.push({
                    email,
                    password: passwordHash,
                    name: `Student ${branch} ${i}`,
                    role: 'student',
                    isApproved: true,
                    isActive: true,
                    profile: {
                        rollNumber: rollNo,
                        branch: branch,
                        section: section,
                        year: year,
                        semester: semester,
                        course: "B.Tech",
                        department: `${branch} Department`
                    }
                });
            }
        }

        // Add a specific known student for testing
        usersData.push({
            email: "arjun.cse@muj.manipal.edu",
            password: passwordHash,
            name: "Arjun Verma",
            role: "student",
            isApproved: true,
            isActive: true,
            profile: {
                rollNumber: "219301123",
                branch: "CSE",
                section: "A",
                year: 3,
                semester: 5,
                course: "B.Tech",
                department: "Computer Science and Engineering (CSE)"
            }
        });

        // 2. Create Faculty
        console.log("   Creating Faculty...");
        const departments = Object.keys(MUJ_STRUCTURE.branches);
        for (const dept of departments) {
            // Create 1 faculty per department
            const shortDept = MUJ_STRUCTURE.branches[dept][0]; // approx
            const email = `faculty.${shortDept.toLowerCase()}@muj.manipal.edu`;

            usersData.push({
                email,
                password: passwordHash,
                name: `Dr. Faculty ${shortDept}`,
                role: 'faculty',
                isApproved: true,
                isActive: true,
                profile: {
                    employeeId: `FAC${shortDept}${Math.floor(Math.random() * 100)}`,
                    department: dept,
                    designation: "Assistant Professor"
                }
            });
        }

        // 3. Insert into Database
        for (const userData of usersData) {
            const { profile, ...userFields } = userData;

            // Check if user exists
            const existing = await User.findOne({ where: { email: userFields.email } });
            if (existing) {
                console.log(`   ⚠️ Skipped ${userFields.email} (Exists)`);
                continue;
            }

            const user = await User.create(userFields);

            if (userFields.role === 'student') {
                await StudentProfile.create({ ...profile, userId: user.id });
            } else if (userFields.role === 'faculty') {
                await FacultyProfile.create({ ...profile, userId: user.id });
            }
            console.log(`   ✅ Created ${userFields.role}: ${userFields.email}`);
        }

        console.log("\n🎉 MUJ Seeding Complete!");

    } catch (error) {
        console.error("❌ Error seeding MUJ data:", error);
    } finally {
        await sequelize.close();
    }
}

seedMUJ();
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
