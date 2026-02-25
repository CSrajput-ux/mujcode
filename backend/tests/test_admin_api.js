const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });
const { sequelize } = require('../src/config/database');
const models = require('../src/models/pg/index');
const { User, AdministrativeRole } = models;

const API_URL = 'http://localhost:5000/api';

const testAdminApi = async () => {
    try {
        await sequelize.authenticate();
        // Get Admin User ID (or any user to assign role to)
        // I need an admin token first.
        // Let's assume ID 1 is admin or create a token with role 'admin'.

        // Find a user to assign role to
        const user = await User.findOne();
        if (!user) return console.log("No user found");
        const targetUserId = user.id; // UUID

        // Find a Role to assign. If none, create one using Model (since no createRole API yet)
        let role = await AdministrativeRole.findOne();
        if (!role) {
            console.log("Creating seed role...");
            role = await AdministrativeRole.create({ name: 'Dean Academics' });
        }
        const roleId = role.id;

        await sequelize.close();

        // Generate Admin Token
        const secret = process.env.JWT_SECRET || 'muj_secret_key_2024';
        const token = jwt.sign({ id: targetUserId, role: 'admin' }, secret, { expiresIn: '1h' });
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Get Roles
        console.log("\nTesting GET /admin/roles...");
        const resRoles = await axios.get(`${API_URL}/admin/roles`, { headers });
        console.log(`Roles Found: ${resRoles.data.length}`);
        if (resRoles.data.length > 0) {
            console.log(` - Role: ${resRoles.data[0].name}`);
        }

        // 2. Assign Role
        console.log(`\nTesting POST /admin/assign-role...`);
        try {
            const resAssign = await axios.post(`${API_URL}/admin/roles/assign`, {
                userId: targetUserId,
                roleId: roleId,
                scopeType: 'University'
            }, { headers });
            console.log("Assign Response:", resAssign.data);
        } catch (e) {
            console.log("Assign Error:", e.response ? e.response.data : e.message);
        }

        // 3. Get Assignments
        console.log("\nTesting GET /admin/roles/assignments...");
        const resAssigns = await axios.get(`${API_URL}/admin/roles/assignments`, { headers });
        console.log(`Assignments Found: ${resAssigns.data.length}`);
        if (resAssigns.data.length > 0) {
            console.log(` - Assigned Role ID: ${resAssigns.data[0].roleId} to User: ${resAssigns.data[0].User ? resAssigns.data[0].User.name : 'Unknown'}`);
        }

    } catch (error) {
        console.error("Test Failed:", error.response ? error.response.data : error.message);
    }
};

testAdminApi();
