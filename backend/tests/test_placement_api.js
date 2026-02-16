const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });
const { sequelize } = require('../src/config/database');
const models = require('../src/models/pg/index');
const { User, StudentEnrollment } = models;
const { JobPosting } = require('../src/models/pg/PlacementModule');

const API_URL = 'http://localhost:5000/api';

const testPlacementApi = async () => {
    try {
        await sequelize.authenticate();
        // Get a student User ID
        const enrollment = await StudentEnrollment.findOne();
        if (!enrollment) return console.log("No student enrollment found");
        const studentId = enrollment.studentId;

        // Get a Job ID
        const job = await JobPosting.findOne({ where: { role: 'Software Engineer' } });
        if (!job) return console.log("No job found");
        const jobId = job.id;

        await sequelize.close();

        // Generate Token
        const secret = process.env.JWT_SECRET || 'muj_secret_key_2024';
        const token = jwt.sign({ id: studentId, role: 'student' }, secret, { expiresIn: '1h' });
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Get Drives
        console.log("\nTesting GET /placements/drives...");
        const resDrives = await axios.get(`${API_URL}/placements/drives`, { headers });
        console.log(`Drives Found: ${resDrives.data.length}`);
        if (resDrives.data.length > 0) {
            console.log(` - Drive: ${resDrives.data[0].title} by ${resDrives.data[0].Company.name}`);
        } else {
            console.log("❌ No Drives returned.");
        }

        // 2. Apply for Job
        console.log(`\nTesting POST /placements/apply for Job ID ${jobId}...`);
        try {
            const resApply = await axios.post(`${API_URL}/placements/apply`, { jobId }, { headers });
            console.log("Apply Response:", resApply.data);
        } catch (e) {
            console.log("Apply Error:", e.response ? e.response.data : e.message);
        }

        // 3. Get My Applications
        console.log("\nTesting GET /placements/my-applications...");
        const resApps = await axios.get(`${API_URL}/placements/my-applications`, { headers });
        console.log(`My Apps Found: ${resApps.data.length}`);
        if (resApps.data.length > 0) {
            console.log(` - Applied to Job ID: ${resApps.data[0].jobId}`);
        } else {
            console.log("❌ No Applications returned.");
        }

    } catch (error) {
        console.error("Test Failed:", error.response ? error.response.data : error.message);
    }
};

testPlacementApi();
