const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const jwt = require('jsonwebtoken');

const API_URL = 'http://localhost:5000/api';

async function testStudentCreation() {
    try {
        console.log('--- Testing Relational Student Creation ---');

        const secret = process.env.JWT_SECRET || 'dev_secret_key_123';
        const token = jwt.sign({ id: 'c0b29848-d308-466d-8874-42f0227181c0', role: 'admin' }, secret, { expiresIn: '1h' });

        const headers = { Authorization: `Bearer ${token}` };

        // 1. Get a section
        const uniRes = await axios.get(`${API_URL}/university/sections`, { headers });
        if (!uniRes.data || uniRes.data.length === 0) {
            console.log('No sections found.');
            return;
        }
        const sectionId = uniRes.data[0].id;
        const branchId = uniRes.data[0].branchId || 1;
        console.log(`Using Section ID: ${sectionId}, Branch ID: ${branchId}`);

        // 2. Create student (WITHOUT branch string, should be auto-filled)
        const studentData = {
            name: 'Relational Student Auto',
            email: `relstudent_auto_${Date.now()}@muj.edu`,
            rollNumber: `RSA${Date.now()}`,
            password: 'password123',
            branchId: branchId,
            sectionId: sectionId,
            year: '1'
        };

        const createRes = await axios.post(`${API_URL}/admin/students`, studentData, { headers });
        console.log('Student Created:', createRes.data.success);
        const userId = createRes.data.data.userId;

        // 3. Verify
        const profileRes = await axios.get(`${API_URL}/student/profile/${userId}`, { headers });
        console.log('Profile fetched:', profileRes.data.success);

        // Profiles usually return data: { ...studentInfo, academicDetails: { ... } }
        const data = profileRes.data.data;
        console.log('Branch string (Auto-filled):', data.branch);
        console.log('Academic Details (Relational):', data.academicDetails);

        if (data.academicDetails && (data.academicDetails.Section || data.academicDetails.sectionId === sectionId)) {
            console.log('PASSED: Student enrollment correctly associated.');
        } else {
            console.log('FAILED: Student enrollment missing.');
        }

    } catch (error) {
        console.error('Test Failed:', error.response?.data || error.message);
    }
}

testStudentCreation();
