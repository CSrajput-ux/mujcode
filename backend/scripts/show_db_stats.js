const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { sequelize } = require('../src/config/database');

// Import Postgres Models
const User = require('../src/models/pg/User');
const StudentProfile = require('../src/models/pg/StudentProfile');
const FacultyProfile = require('../src/models/pg/FacultyProfile');
const CompanyProfile = require('../src/models/pg/CompanyProfile');
const AdminProfile = require('../src/models/pg/AdminProfile');
const { Department, Program, Branch: PgBranch, Subject, Section, AcademicYear } = require('../src/models/pg/UniversityStructure');

// Import Mongo Models
const Test = require('../src/models/mongo/Test');
const Question = require('../src/models/mongo/Question');
const Course = require('../src/models/mongo/Course');
const Assignment = require('../src/models/mongo/Assignment');
const Submission = require('../src/models/mongo/Submission');
const ActivityLog = require('../src/models/mongo/ActivityLog');
const Branch = require('../src/models/mongo/Branch');
const Placement = require('../src/models/mongo/Placement');

// List of critical Mongo models to check
const mongoModels = {
    Test, Question, Course, Assignment, Submission, ActivityLog, Branch, Placement
};

const showStats = async () => {
    try {
        console.log("📊 Connecting to Databases...");

        // 1. PostgreSQL Stats
        await sequelize.authenticate();
        console.log("\n🐘 PostgreSQL / SQLite Stats:");
        console.log("----------------------------");

        const userCount = await User.count();
        const studentCount = await StudentProfile.count();
        const facultyCount = await FacultyProfile.count();
        const companyCount = await CompanyProfile.count();
        const adminCount = await AdminProfile.count();

        console.log(`Users (Total): ${userCount}`);
        console.log(`Students: ${studentCount}`);
        console.log(`Faculty: ${facultyCount}`);
        console.log(`Companies: ${companyCount}`);
        console.log(`Admins: ${adminCount}`);

        const deptCount = await Department.count();
        const progCount = await Program.count();
        const branchCount = await PgBranch.count();
        const subjectCount = await Subject.count();
        const sectionCount = await Section.count();

        console.log(`Departments: ${deptCount}`);
        console.log(`Programs: ${progCount}`);
        console.log(`Branches: ${branchCount}`);
        console.log(`Subjects: ${subjectCount}`);
        console.log(`Sections: ${sectionCount}`);

        // 2. MongoDB Stats
        if (process.env.MONGO_URI) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("\n🍃 MongoDB Stats:");
            console.log("----------------------------");

            for (const [name, model] of Object.entries(mongoModels)) {
                const count = await model.countDocuments();
                console.log(`${name}s: ${count}`);
            }
        } else {
            console.log("\n⚠️ MONGO_URI not found in .env");
        }

        console.log("\n✅ Database Overview Complete");

    } catch (error) {
        console.error("❌ Error fetching stats:", error);
    } finally {
        await sequelize.close();
        await mongoose.disconnect();
    }
};

showStats();
