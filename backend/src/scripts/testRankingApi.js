const axios = require('axios');

const testRanking = async () => {
    try {
        const userId = '2eabd3c7-a706-49cd-b008-76cb089aa5f1';
        console.log(`Testing Ranking API for userId: ${userId}`);

        const response = await axios.get(`http://localhost:5000/api/student/rankings/${userId}`);

        console.log('✅ API Response Status:', response.status);
        console.log('✅ API Response Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ API Error:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
};

testRanking();
