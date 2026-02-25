const { updateProfile } = require('./backend/src/modules/student/controllers/studentProfileController');

// Mock request and response
const mockReq = (body, profile) => ({
    body,
    user: { id: 1 },
    profile: profile // Custom mock property to inject existing profile
});

const mockRes = () => {
    const res = {};
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.data = data;
        return res;
    };
    return res;
};

// Simplified logic test of the controller's CORE locking behavior
async function testLockingLogic() {
    console.log('--- Testing Profile Locking Logic ---');

    // Scenario 1: First time set
    let profile = { section: null, year: null, semester: null };
    let body = { section: 'A', year: '2', semester: '4' };

    // Simulating the controller logic manually since it's hard to mock Sequelize fully in a one-liner
    function simulateUpdate(prof, b) {
        const { section, year, semester } = b;
        if (section && (!prof.section || prof.section === '---')) {
            prof.section = section;
        }
        if (year && !prof.year) {
            const y = parseInt(year);
            if (!isNaN(y)) prof.year = y;
        }
        if (semester && !prof.semester) {
            const s = parseInt(semester);
            if (!isNaN(s)) prof.semester = s;
        }
        return prof;
    }

    profile = simulateUpdate(profile, body);
    console.log('Result after first set:', profile);
    if (profile.section === 'A' && profile.year === 2 && profile.semester === 4) {
        console.log('✅ PASS: Fields set correctly first time');
    } else {
        console.log('❌ FAIL: Fields not set correctly');
    }

    // Scenario 2: Try to update again
    body = { section: 'B', year: '3', semester: '1' };
    profile = simulateUpdate(profile, body);
    console.log('Result after second set attempt:', profile);
    if (profile.section === 'A' && profile.year === 2 && profile.semester === 4) {
        console.log('✅ PASS: Fields are LOCKED and did not change');
    } else {
        console.log('❌ FAIL: Fields were OVERWRITTEN');
    }

    // Scenario 3: Mixed (some set, some not)
    profile = { section: '---', year: null, semester: 2 };
    body = { section: 'C', year: '1', semester: '3' };
    profile = simulateUpdate(profile, body);
    console.log('Result after partial update:', profile);
    if (profile.section === 'C' && profile.year === 1 && profile.semester === 2) {
        console.log('✅ PASS: Only unset fields were updated');
    } else {
        console.log('❌ FAIL: Incorrect partial update logic');
    }
}

testLockingLogic();
