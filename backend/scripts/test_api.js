const axios = require('axios');

const testApi = async () => {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'dr.rishi.gupta@jaipur.manipal.edu',
            password: 'dr.rishi.gupta'
        });
        const token = loginRes.data.token;
        console.log('Logged in. Token:', token.substring(0, 20) + '...');

        console.log('Fetching faculties from API...');
        const res = await axios.get('http://localhost:5000/api/university/faculties', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Status:', res.status);
        console.log('Data:', JSON.stringify(res.data, null, 2));
    } catch (error) {
        console.error('Error fetching API:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
};

testApi();
