<<<<<<< HEAD
const { User } = require('../src/models/pg');

(async () => {
    try {
        const users = await User.findAll();
        console.log('--- Current Users ---');
        users.forEach(u => console.log(`- ${u.email} (${u.role})`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
=======
const { User } = require('../src/models/pg');

(async () => {
    try {
        const users = await User.findAll();
        console.log('--- Current Users ---');
        users.forEach(u => console.log(`- ${u.email} (${u.role})`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
