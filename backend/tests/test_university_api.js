<<<<<<< HEAD
const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const API_URL = 'http://localhost:5000/api';

// We need a valid token. Let's try to login as a student or admin if possible.
// Or we can mock the token if we have the secret, but login is better validation.
// Assuming we have a user seeded. Let's try to login as the faculty created earlier or a student.
// The seed usually creates 'test@student.com' / 'password' or similar. 
// Let's use the default student or faculty credentials from seed.js if known.
// Fallback: create a token manually if login fails (requests require jsonwebtoken).

const loginAndTest = async () => {
    try {
        // 1. Login (Try a known user, or just use a hardcoded token if you have one from logs)
        // I will try to login with a user I know exists or was seeded.
        // Let's rely on 'admin' user if exists, or 'student'. 
        // In previous steps, we saw 'migrate_users' found users.
        // Let's try to find a user credentials.
        // If we can't login, we can't test. I'll assume we can use a generated token script instead.

        console.log("⚠️  Skipping Login - Generating Token directly for testing...");
        // Actually, better to just generate a token using jsonwebtoken and the JWT_SECRET from .env
        // But verifying login works is also good.
        // Let's try to login with the faculty user created in previous sessions: 'dr.rishi.gupta@jaipur.manipal.edu' / 'dr.rishi.gupta'

        let token;
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: 'dr.rishi.gupta@jaipur.manipal.edu',
                password: 'dr.rishi.gupta'
            });
            token = loginRes.data.token;
            console.log("✅ Login Successful. Token obtained.");
        } catch (e) {
            console.log("⚠️ Login failed (User might not exist). Trying default admin...");
            // Try default admin? Or just stop.
            // Let's try to generate 'mock' token using jsonwebtoken if login fails.
            const jwt = require('jsonwebtoken');
            const secret = process.env.JWT_SECRET || 'muj_secret_key_2024'; // Fallback check
            token = jwt.sign({ id: 1, role: 'admin' }, secret, { expiresIn: '1h' });
            console.log("⚠️ Generated Mock Token.");
        }

        const headers = { Authorization: `Bearer ${token}` };

        // 2. Test /faculties
        console.log("\nTesting /university/faculties...");
        const facRes = await axios.get(`${API_URL}/university/faculties`, { headers });
        console.log("Faculties:", facRes.data);

        // 3. Test /departments
        console.log("\nTesting /university/departments...");
        const deptRes = await axios.get(`${API_URL}/university/departments`, { headers });
        console.log(`Departments: Found ${deptRes.data.length} items`);
        if (deptRes.data.length > 0) {
            console.log("Sample Dept:", deptRes.data[0].name);
            const deptId = deptRes.data[0].id;

            // 4. Test /programs
            console.log(`\nTesting /university/programs?deptId=${deptId}...`);
            const progRes = await axios.get(`${API_URL}/university/programs?deptId=${deptId}`, { headers });
            console.log(`Programs: Found ${progRes.data.length} items`);

            if (progRes.data.length > 0) {
                const progId = progRes.data[0].id;

                // 5. Test /branches
                console.log(`\nTesting /university/branches?progId=${progId}...`);
                const branchRes = await axios.get(`${API_URL}/university/branches?progId=${progId}`, { headers });
                console.log(`Branches: Found ${branchRes.data.length} items`);

                if (branchRes.data.length > 0) {
                    const branchId = branchRes.data[0].id;

                    // 6. Test /subjects
                    console.log(`\nTesting /university/subjects?branchId=${branchId}&semester=3...`);
                    const subjectRes = await axios.get(`${API_URL}/university/subjects?branchId=${branchId}&semester=3`, { headers });
                    console.log(`Subjects: Found ${subjectRes.data.length} items`);
                    subjectRes.data.forEach(s => console.log(` - ${s.code}: ${s.name}`));
                }
            }
        }

    } catch (error) {
        console.error("❌ Test Failed:", error.response ? error.response.data : error.message);
    }
};

loginAndTest();
=======
const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const API_URL = 'http://localhost:5000/api';

// We need a valid token. Let's try to login as a student or admin if possible.
// Or we can mock the token if we have the secret, but login is better validation.
// Assuming we have a user seeded. Let's try to login as the faculty created earlier or a student.
// The seed usually creates 'test@student.com' / 'password' or similar. 
// Let's use the default student or faculty credentials from seed.js if known.
// Fallback: create a token manually if login fails (requests require jsonwebtoken).

const loginAndTest = async () => {
    try {
        // 1. Login (Try a known user, or just use a hardcoded token if you have one from logs)
        // I will try to login with a user I know exists or was seeded.
        // Let's rely on 'admin' user if exists, or 'student'. 
        // In previous steps, we saw 'migrate_users' found users.
        // Let's try to find a user credentials.
        // If we can't login, we can't test. I'll assume we can use a generated token script instead.

        console.log("⚠️  Skipping Login - Generating Token directly for testing...");
        // Actually, better to just generate a token using jsonwebtoken and the JWT_SECRET from .env
        // But verifying login works is also good.
        // Let's try to login with the faculty user created in previous sessions: 'dr.rishi.gupta@jaipur.manipal.edu' / 'dr.rishi.gupta'

        let token;
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: 'dr.rishi.gupta@jaipur.manipal.edu',
                password: 'dr.rishi.gupta'
            });
            token = loginRes.data.token;
            console.log("✅ Login Successful. Token obtained.");
        } catch (e) {
            console.log("⚠️ Login failed (User might not exist). Trying default admin...");
            // Try default admin? Or just stop.
            // Let's try to generate 'mock' token using jsonwebtoken if login fails.
            const jwt = require('jsonwebtoken');
            const secret = process.env.JWT_SECRET || 'muj_secret_key_2024'; // Fallback check
            token = jwt.sign({ id: 1, role: 'admin' }, secret, { expiresIn: '1h' });
            console.log("⚠️ Generated Mock Token.");
        }

        const headers = { Authorization: `Bearer ${token}` };

        // 2. Test /faculties
        console.log("\nTesting /university/faculties...");
        const facRes = await axios.get(`${API_URL}/university/faculties`, { headers });
        console.log("Faculties:", facRes.data);

        // 3. Test /departments
        console.log("\nTesting /university/departments...");
        const deptRes = await axios.get(`${API_URL}/university/departments`, { headers });
        console.log(`Departments: Found ${deptRes.data.length} items`);
        if (deptRes.data.length > 0) {
            console.log("Sample Dept:", deptRes.data[0].name);
            const deptId = deptRes.data[0].id;

            // 4. Test /programs
            console.log(`\nTesting /university/programs?deptId=${deptId}...`);
            const progRes = await axios.get(`${API_URL}/university/programs?deptId=${deptId}`, { headers });
            console.log(`Programs: Found ${progRes.data.length} items`);

            if (progRes.data.length > 0) {
                const progId = progRes.data[0].id;

                // 5. Test /branches
                console.log(`\nTesting /university/branches?progId=${progId}...`);
                const branchRes = await axios.get(`${API_URL}/university/branches?progId=${progId}`, { headers });
                console.log(`Branches: Found ${branchRes.data.length} items`);

                if (branchRes.data.length > 0) {
                    const branchId = branchRes.data[0].id;

                    // 6. Test /subjects
                    console.log(`\nTesting /university/subjects?branchId=${branchId}&semester=3...`);
                    const subjectRes = await axios.get(`${API_URL}/university/subjects?branchId=${branchId}&semester=3`, { headers });
                    console.log(`Subjects: Found ${subjectRes.data.length} items`);
                    subjectRes.data.forEach(s => console.log(` - ${s.code}: ${s.name}`));
                }
            }
        }

    } catch (error) {
        console.error("❌ Test Failed:", error.response ? error.response.data : error.message);
    }
};

loginAndTest();
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
