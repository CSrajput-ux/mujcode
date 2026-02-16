// Quick test script for academic APIs
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/academic';

async function testAPIs() {
    console.log('🧪 Testing MUJ Academic Structure APIs\n');
    console.log('='.repeat(60));

    try {
        // Test 1: Get all branches
        console.log('\n1️⃣ Testing GET /api/academic/branches');
        const branchesRes = await axios.get(`${BASE_URL}/branches`);
        console.log(`   ✅ Success! Found ${branchesRes.data.count} branches`);
        console.log(`   Sample: ${branchesRes.data.data[0].code} - ${branchesRes.data.data[0].name}`);

        // Test 2: Get specific branch
        console.log('\n2️⃣ Testing GET /api/academic/branches/CSE');
        const cseRes = await axios.get(`${BASE_URL}/branches/CSE`);
        console.log(`   ✅ Success! ${cseRes.data.data.name}`);
        console.log(`   Specializations: ${cseRes.data.data.specializations.slice(0, 3).join(', ')}...`);

        // Test 3: Get courses for CSE Semester 1
        console.log('\n3️⃣ Testing GET /api/academic/courses/CSE/1');
        const coursesRes = await axios.get(`${BASE_URL}/courses/CSE/1`);
        console.log(`   ✅ Success! Found ${coursesRes.data.count} courses for CSE Semester 1`);
        coursesRes.data.data.slice(0, 3).forEach(c => {
            console.log(`   - ${c.courseCode}: ${c.courseName} (${c.credits} credits)`);
        });

        // Test 4: Get academic roadmap
        console.log('\n4️⃣ Testing GET /api/academic/roadmap/CSE');
        const roadmapRes = await axios.get(`${BASE_URL}/roadmap/CSE`);
        console.log(`   ✅ Success! Generated roadmap for ${roadmapRes.data.branch.name}`);
        console.log(`   Total Credits: ${roadmapRes.data.totalCredits}`);
        console.log(`   Semesters covered: ${roadmapRes.data.roadmap.length}`);

        console.log('\n' + '='.repeat(60));
        console.log('✅ All API tests passed successfully!\n');

    } catch (error) {
        console.error('❌ API Test Failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

testAPIs();
