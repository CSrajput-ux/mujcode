<<<<<<< HEAD
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/tests';

async function verifyVisibility() {
    let testId = null;
    try {
        console.log('1. Creating a Global Test (No branch/section)...');
        const createRes = await axios.post(`${BASE_URL}/create`, {
            title: 'Global Visibility Test',
            type: 'Quiz',
            testType: 'MCQ',
            duration: 10,
            startTime: new Date(),
            isPublished: true, // Important!
            questions: []
        });
        testId = createRes.data._id || createRes.data.testId;
        console.log(`   Test Created: ${testId}`);

        console.log('2. Fetching tests WITHOUT filters (Global View)...');
        const resAll = await axios.get(BASE_URL);
        const foundAll = resAll.data.find(t => t._id === testId);
        console.log(`   Visible in global view? ${!!foundAll}`);

        console.log('3. Fetching tests WITH filters (Simulating CSE Student)...');
        // branch=CSE, section=A. Should still find the global test.
        const resFilter = await axios.get(`${BASE_URL}?branch=CSE&section=A&semester=5`);
        const foundFilter = resFilter.data.find(t => t._id === testId);

        if (foundFilter) {
            console.log('✅ SUCCESS: Global test is visible to filtered student.');
        } else {
            console.error('❌ FAILURE: Global test is HIDDEN from filtered student.');
            console.log('   Response length:', resFilter.data.length);
        }

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) console.error('Data:', error.response.data);
    } finally {
        if (testId) {
            console.log('4. Cleaning up...');
            await axios.delete(`${BASE_URL}/${testId}`);
            console.log('   Test deleted.');
        }
    }
}

verifyVisibility();
=======
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/tests';

async function verifyVisibility() {
    let testId = null;
    try {
        console.log('1. Creating a Global Test (No branch/section)...');
        const createRes = await axios.post(`${BASE_URL}/create`, {
            title: 'Global Visibility Test',
            type: 'Quiz',
            testType: 'MCQ',
            duration: 10,
            startTime: new Date(),
            isPublished: true, // Important!
            questions: []
        });
        testId = createRes.data._id || createRes.data.testId;
        console.log(`   Test Created: ${testId}`);

        console.log('2. Fetching tests WITHOUT filters (Global View)...');
        const resAll = await axios.get(BASE_URL);
        const foundAll = resAll.data.find(t => t._id === testId);
        console.log(`   Visible in global view? ${!!foundAll}`);

        console.log('3. Fetching tests WITH filters (Simulating CSE Student)...');
        // branch=CSE, section=A. Should still find the global test.
        const resFilter = await axios.get(`${BASE_URL}?branch=CSE&section=A&semester=5`);
        const foundFilter = resFilter.data.find(t => t._id === testId);

        if (foundFilter) {
            console.log('✅ SUCCESS: Global test is visible to filtered student.');
        } else {
            console.error('❌ FAILURE: Global test is HIDDEN from filtered student.');
            console.log('   Response length:', resFilter.data.length);
        }

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) console.error('Data:', error.response.data);
    } finally {
        if (testId) {
            console.log('4. Cleaning up...');
            await axios.delete(`${BASE_URL}/${testId}`);
            console.log('   Test deleted.');
        }
    }
}

verifyVisibility();
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
