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
