require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcryptjs');
const { sequelize } = require('../src/config/database');
const User = require('../src/models/pg/User');
const FacultyProfile = require('../src/models/pg/FacultyProfile');
const AdminProfile = require('../src/models/pg/AdminProfile');
const CompanyProfile = require('../src/models/pg/CompanyProfile');

const USERS_TO_ADD = [
    {
        email: "dr.rishi.gupta@jaipur.manipal.edu",
        password: "dr.rishi.gupta",
        name: "Dr. Rishi Gupta",
        role: "faculty",
        profileModel: FacultyProfile,
        profileData: {
            employeeId: "FAC_RISHI_001",
            department: "Computer Science and Engineering (CSE)",
            designation: "Professor"
        }
    },
    {
        email: "chhotu.singh@jaipur.manipal.edu",
        password: "chhotu.singh",
        name: "Chhotu Singh",
        role: "admin",
        profileModel: AdminProfile,
        profileData: {
            accessLevel: "SUPER_ADMIN"
        }
    },
    {
        email: "google.cp@company.manipal.edu",
        password: "google.cp",
        name: "Google Campus CP",
        role: "company",
        profileModel: CompanyProfile,
        profileData: {
            companyName: "Google",
            website: "https://careers.google.com",
            hrContact: "hr@google.com"
        }
    }
];

async function seedSpecificUsers() {
    try {
        console.log("🔄 Connecting to Database...");
        await sequelize.authenticate();

        console.log("🚦 Seeding Specific Users...");

        for (const userData of USERS_TO_ADD) {
            const { email, password, name, role, profileModel, profileData } = userData;

            // Check if user exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                console.log(`⚠️ User ${email} already exists. Skipping.`);
                continue;
            }

            // Create User
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await User.create({
                email,
                password: hashedPassword,
                name,
                role,
                isApproved: true,
                isActive: true
            });

            // Create Profile
            if (profileModel) {
                await profileModel.create({
                    userId: user.id,
                    ...profileData
                });
            }

            console.log(`✅ Created ${role}: ${email} (Password: ${password})`);
        }

        console.log("🎉 Specific Users Seeded Successfully!");

    } catch (error) {
        console.error("❌ Error seeding specific users:", error);
    } finally {
        await sequelize.close();
    }
}

seedSpecificUsers();
