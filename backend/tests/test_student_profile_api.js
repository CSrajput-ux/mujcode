const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });
const { sequelize } = require('../src/config/database');
// Import EVERYTHING from index to ensure associations
const models = require('../src/models/pg/index');
const { StudentEnrollment } = require('../src/models/pg/UniversityAssociations');
const { User, StudentProfile } = models; // Deconstruct from index export

const API_URL = 'http://localhost:5000/api';

const testStudentProfile = async () => {
    try {
        console.log("Starting DB Checks...");
        await sequelize.authenticate();

        const enrollment = await StudentEnrollment.findOne();
        if (!enrollment) {
            console.log("❌ No Student Enrollment found to test with.");
            return;
        }
        const studentId = enrollment.studentId;
        console.log(`Using Student ID: ${studentId}`);

        // Check user
        const userCheck = await User.findByPk(studentId);
        console.log(`User exists: ${!!userCheck}`);

        // Check Profile Raw
        const profileCheck = await StudentProfile.findOne({ where: { userId: studentId } });
        console.log(`Profile exists (Raw): ${!!profileCheck}`);

        // Check Profile WITH User (Association)
        try {
            const profileWithUser = await StudentProfile.findOne({
                where: { userId: studentId },
                include: [{ model: User }]
            });
            console.log(`Profile search with Include User: ${!!profileWithUser}`);
            if (!profileWithUser) {
                console.log("❌ CRITICAL: Association Failed locally!");
            }
        } catch (err) {
            console.log("❌ Error checking Association:", err.message);
        }

        await sequelize.close();

        // 2. Test API
        const secret = process.env.JWT_SECRET || 'muj_secret_key_2024';
        const token = jwt.sign({ id: studentId, role: 'student' }, secret, { expiresIn: '1h' });

        const headers = { Authorization: `Bearer ${token}` };

        console.log(`\nTesting API /student/profile/${studentId}...`);
        const res = await axios.get(`${API_URL}/student/profile/${studentId}`, { headers });
        const profile = res.data.profile;

        console.log("API Success. Profile ID:", profile.id);
        if (profile.academicDetails) {
            console.log("✅ Academic Details Found.");
        } else {
            console.log("❌ Academic Details MISSING.");
        }

    } catch (error) {
        console.error("❌ API Test Failed:", error.response ? JSON.stringify(error.response.data) : error.message);
    }
};

testStudentProfile();
