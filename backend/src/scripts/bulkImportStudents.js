const { sequelize, connectDB } = require('../config/database');
const User = require('../models/pg/User');
const StudentProfile = require('../models/pg/StudentProfile');
const bcrypt = require('bcryptjs');

// DATA SOURCE
const students = [
    { name: "AKSHIT RAJ", regNo: "2427030465" },
    { name: "SAHAJ UTTAM", regNo: "2427030466" },
    { name: "KAVYA MITTAL", regNo: "2427030467" },
    { name: "OJASWITA MEENA", regNo: "2427030468" },
    { name: "PARV", regNo: "2427030469" },
    { name: "PARTH SHARMA", regNo: "2427030471" },
    { name: "HANNAH AHMAD", regNo: "2427030472" },
    { name: "SHORYA GOYAL", regNo: "2427030473" },
    { name: "VISHESH JAISWAL", regNo: "2427030474" },
    { name: "BHAVVY AGARWAAL", regNo: "2427030476" },
    { name: "NITYAM SINGH", regNo: "2427030477" },
    { name: "AARAV KAPOOR", regNo: "2427030478" },
    { name: "SAMYAK JAIN", regNo: "2427030479" },
    { name: "ADITYA GUPTA", regNo: "2427030480" },
    { name: "GOOTY MANJU ABHIRAM", regNo: "2427030481" },
    { name: "AAKARSH SRIVASTAVA", regNo: "2427030482" },
    { name: "GIRIJA PRASAD NAYAK", regNo: "2427030483" },
    { name: "DARSH . SINHA", regNo: "2427030484" },
    { name: "AANYA SINGH SAINI", regNo: "2427030485" },
    { name: "NAMAN AGGARWAL", regNo: "2427030486" },
    { name: "BHANI KAUR", regNo: "2427030487" },
    { name: "APURV BAGARIA", regNo: "2427030488" },
    { name: "AMRUTA PATIL", regNo: "2427030489" },
    { name: "UDAYAN JOSHI", regNo: "2427030490" },
    { name: "SNEDON AUBREY CUTINHA", regNo: "2427030491" },
    { name: "ADITI KISHORE", regNo: "2427030492" },
    { name: "KRRISH AJMERA", regNo: "2427030493" },
    { name: "SHUBH KHATTRI", regNo: "2427030494" },
    { name: "UDIT MISHRA", regNo: "2427030495" },
    { name: "VEDIKA TAILOR", regNo: "2427030496" },
    { name: "SHREYAS SHRIVASTAVA", regNo: "2427030497" },
    { name: "VAIBHAV SINGH", regNo: "2427030499" },
    { name: "SAANVI BANSAL", regNo: "2427030500" },
    { name: "ANANYA SAHU", regNo: "2427030501" },
    { name: "SHIVAM LALWANI", regNo: "2427030502" },
    { name: "KRISH TANWAR", regNo: "2427030503" },
    { name: "DEVAANSHEE AGARWAL", regNo: "2427030504" },
    { name: "ANKIT KUMAR PANDA", regNo: "2427030505" },
    { name: "SHARANYA KUMAR", regNo: "2427030506" },
    { name: "BHAVYA KALRA", regNo: "2427030507" },
    { name: "MOKSH REDDY", regNo: "2427030508" },
    { name: "TRESHAA PATHAK", regNo: "2427030509" },
    { name: "TANISHKA SINGH", regNo: "2427030510" },
    { name: "KHUSHI WADHWA", regNo: "2427030511" },
    { name: "PARV SADHWANI", regNo: "2427030512" },
    { name: "AHANA BAJPAI", regNo: "2427030513" },
    { name: "BHAVESH AGRAWAL", regNo: "2427030514" },
    { name: "GAUTAM GIRIRAJ SHUKLA", regNo: "2427030515" },
    { name: "VARSHITHA VASAGUDDAM", regNo: "2427030516" },
    { name: "KHWAISH VARSHNEY", regNo: "2427030518" },
    { name: "NITIN POONIA", regNo: "2427030519" },
    { name: "MUKESH KUMAR CHOWDHARY", regNo: "2427030520" },
    { name: "CHHOTU .", regNo: "2427030521" },
    { name: "ADITYA AGGARWAL", regNo: "2427030522" },
    { name: "ANANTIKA SISODIYA", regNo: "2427030523" },
    { name: "NIRANJAN RATHORE", regNo: "2427030524" },
    { name: "DHRUV SHARMA", regNo: "2427030525" },
    { name: "VARUN RATHORE", regNo: "2427030526" },
    { name: "ATHARV SHARMA", regNo: "2427030527" },
    { name: "KUSHAGRA GOYAL", regNo: "2427030528" },
    { name: "ANVI SHREE", regNo: "2427030529" },
    { name: "VIDUSHI SINGHANIA", regNo: "2427030530" },
    { name: "KRITIKA CHARUDUTT BUTALA", regNo: "2427030532" },
    { name: "ISHITA SINGH", regNo: "2427030533" },
    { name: "SUYASH PANDEY", regNo: "2427030534" },
    { name: "SAKSHAM SINGH", regNo: "2427030535" },
    { name: "VAYAM AVINASH OJHA", regNo: "2427030536" },
    { name: "SAVNI GOYAL", regNo: "2427030537" },
    { name: "HARSHITA .", regNo: "2427030538" },
    { name: "NINAD GUPTA", regNo: "2427030539" },
    { name: "GAUTAM SAHU", regNo: "2427030540" },
    { name: "ADITYA PRAKASH", regNo: "2427030541" },
    { name: "KRISH VAID", regNo: "2427030542" },
    { name: "GAURI .", regNo: "2427030543" },
    { name: "MANYA AGARWAL", regNo: "2427030545" },
    { name: "CHAITANYA KHOKHAR", regNo: "2427030546" },
    { name: "KRITIK SAHA", regNo: "2427030549" },
    { name: "AROMA CHAURASIA", regNo: "2427030550" },
    { name: "DEVANSH SINGH RAWAT", regNo: "2427030551" },
    { name: "KUSHAL SHARMA", regNo: "2427030552" },
    { name: "PRAGYA MRIDU", regNo: "2427030553" },
    { name: "HRISHITI MAHAJAN", regNo: "2427030719" }
];

const importStudents = async () => {
    try {
        await connectDB();
        await sequelize.sync();

        console.log(`🚀 Starting import for ${students.length} students...`);

        for (const student of students) {
            // Logic:
            // Username = FirstName.RegNo@muj.manipal.edu (lowercase)
            // Password = FirstName.RegNo (lowercase)

            const firstName = student.name.split(' ')[0].toLowerCase().trim();
            const username = `${firstName}.${student.regNo}@muj.manipal.edu`;
            const passwordStr = `${firstName}.${student.regNo}`;

            // Check if user exists
            const existingUser = await User.findOne({ where: { email: username } });
            if (existingUser) {
                console.log(`⚠️ User ${username} already exists. Skipping.`);
                continue;
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(passwordStr, salt);

            // Create User
            const user = await User.create({
                name: student.name,
                email: username,
                password: hashedPassword,
                role: 'student',
                isApproved: true, // Auto-approve
                isActive: true
            });

            // Create Profile
            await StudentProfile.create({
                userId: user.id,
                rollNumber: student.regNo,
                branch: 'Unknown', // Default
                year: 1, // Default
                section: 'A' // Default
            });

            console.log(`✅ Imported: ${student.name} (${username})`);
        }

        console.log('🎉 Import completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Import failed:', error);
        process.exit(1);
    }
};

importStudents();
