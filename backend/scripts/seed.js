// File: seed.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../src/config/database');

// Import Models Directly
const User = require('../src/models/pg/User');
const StudentProfile = require('../src/models/pg/StudentProfile');
const FacultyProfile = require('../src/models/pg/FacultyProfile');
const CompanyProfile = require('../src/models/pg/CompanyProfile');
const AdminProfile = require('../src/models/pg/AdminProfile');

// Manual Associations (Workaround for index.js issues)
const setupAssociations = () => {
    try {
        User.hasOne(StudentProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
        StudentProfile.belongsTo(User, { foreignKey: 'userId' });

        User.hasOne(FacultyProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
        FacultyProfile.belongsTo(User, { foreignKey: 'userId' });

        User.hasOne(CompanyProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
        CompanyProfile.belongsTo(User, { foreignKey: 'userId' });

        User.hasOne(AdminProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
        AdminProfile.belongsTo(User, { foreignKey: 'userId' });
    } catch (e) {
        console.error("Association Setup Error:", e);
    }
};

// Helper: Extract Password from Email
const getPassword = (email) => email.split('@')[0];

// Helper: Extract Details from Email
const extractDetails = (email, role) => {
    const localPart = email.split('@')[0];
    let name = localPart.replace(/[0-9.]/g, ' ').trim(); // Remove numbers/dots -> Name approximation
    name = name.charAt(0).toUpperCase() + name.slice(1); // Title case

    let rollNumber = null;
    if (role === 'student') {
        const match = localPart.match(/\d+/);
        rollNumber = match ? match[0] : Math.floor(1000000000 + Math.random() * 9000000000).toString();
    }
    return { name, rollNumber };
};

// Database Seeder
const seedDatabase = async () => {
    setupAssociations();

    try {
        console.log("🔄 Syncing Database...");
        await sequelize.sync({ alter: true });
        console.log("✅ Database Synced.");

        const usersToCreate = [
            // 1. Mandatory Users
            { email: "chhotu.2427030521@muj.manipal.edu", role: "student", branch: "CSE" },
            { email: "dr.rishigupta@jaipur.manipal.edu", role: "faculty", dept: "CSE", desig: "HOD" },
            { email: "hr@google.com", role: "company", companyName: "Google India" },
            { email: "admin@mujcode.in", role: "admin", access: "SUPER_ADMIN" },

            // 2. Random Students
            { email: "rahul.2427011111@muj.manipal.edu", role: "student", branch: "IT" },
            { email: "priya.2427022222@muj.manipal.edu", role: "student", branch: "ECE" },

            // 3. Random Faculty
            { email: "dr.anitavarma@jaipur.manipal.edu", role: "faculty", dept: "IT", desig: "Professor" },

            // 4. Random Company
            { email: "hiring@amazon.com", role: "company", companyName: "Amazon" }
        ];

        console.log("\n🚀 Creating Users...");

        for (const u of usersToCreate) {
            const passwordRaw = getPassword(u.email);
            const hashedPassword = await bcrypt.hash(passwordRaw, 10);
            const { name, rollNumber } = extractDetails(u.email, u.role);

            await sequelize.transaction(async (t) => {
                const existing = await User.findOne({ where: { email: u.email } });

                if (!existing) {
                    const user = await User.create({
                        email: u.email,
                        password: hashedPassword,
                        name: name || "User",
                        role: u.role,
                        isApproved: true,
                        isActive: true
                    }, { transaction: t });

                    // Create Profile based on Role
                    if (u.role === 'student') {
                        await StudentProfile.create({
                            userId: user.id,
                            rollNumber: rollNumber,
                            branch: u.branch || "CSE",
                            section: "A",
                            year: 2
                        }, { transaction: t });
                    } else if (u.role === 'faculty') {
                        await FacultyProfile.create({
                            userId: user.id,
                            employeeId: "FAC" + Math.floor(Math.random() * 1000),
                            department: u.dept || "CSE",
                            designation: u.desig || "Assistant Professor"
                        }, { transaction: t });
                    } else if (u.role === 'company') {
                        await CompanyProfile.create({
                            userId: user.id,
                            companyName: u.companyName,
                            website: `https://${u.companyName.toLowerCase().replace(/ /g, '')}.com`
                        }, { transaction: t });
                    } else if (u.role === 'admin') {
                        await AdminProfile.create({
                            userId: user.id,
                            accessLevel: u.access || "ADMIN"
                        }, { transaction: t });
                    }
                    console.log(`✅ Created [${u.role.toUpperCase()}]: ${u.email} | Pass: ${passwordRaw}`);
                } else {
                    console.log(`⚠️  Exists  [${u.role.toUpperCase()}]: ${u.email}`);
                }
            });
        }

        // --- 5. Seed MongoDB (Tests & Questions) ---
        console.log("\n🌱 Seeding MongoDB (Tests & Questions)...");
        const mongoose = require('mongoose');
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGO_URI);
        }

        const Question = require('../src/models/mongo/Question');
        const Test = require('../src/models/mongo/Test');

        // Clear existing
        await Question.deleteMany({});
        await Test.deleteMany({});

        // Create Questions
        const questionsData = [
            { text: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], correctOption: 1, marks: 5, difficulty: "Medium", type: "MCQ" },
            { text: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Array", "Tree"], correctOption: 1, marks: 5, difficulty: "Easy", type: "MCQ" },
            { text: "React is a framework.", options: ["True", "False"], correctOption: 1, marks: 2, difficulty: "Easy", type: "TrueFalse" }, // False, it's a library
            { text: "Which hook is used for side effects in React?", options: ["useState", "useEffect", "useRef", "useMemo"], correctOption: 1, marks: 5, difficulty: "Medium", type: "MCQ" }
        ];

        const createdQuestions = await Question.insertMany(questionsData);
        const qIds = createdQuestions.map(q => q._id);

        // Create Tests
        await Test.create([
            {
                title: "Live DSA Quiz",
                type: "Quiz",
                duration: 15,
                questions: qIds.slice(0, 2),
                status: "Live",
                startTime: new Date(),
                proctored: true,
                description: "A quick quiz on Data Structures."
            },
            {
                title: "Upcoming React Assessment",
                type: "Assessment",
                duration: 45,
                questions: qIds.slice(2, 4),
                status: "Upcoming",
                startTime: new Date(Date.now() + 86400000), // Tomorrow
                proctored: false,
                description: "Test your React knowledge."
            },
            {
                title: "Completed General Test",
                type: "Quiz",
                duration: 10,
                questions: qIds,
                status: "Completed",
                startTime: new Date(Date.now() - 86400000), // Yesterday
                proctored: false
            }
        ]);
        console.log("✅ MongoDB Seeded Successfully.");

        console.log("\n🎉 SEEDING COMPLETE! You can login with the emails printed above matches.");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error seeding data:", error);
        process.exit(1);
    }
};

seedDatabase();