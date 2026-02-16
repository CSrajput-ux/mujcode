<<<<<<< HEAD
const { sequelize } = require('../src/config/database');
const { User } = require('../src/models/pg/index');

async function check() {
    try {
        await sequelize.authenticate();
        console.log('✅ Auth success');

        const [tables] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
        console.log('Existing Tables:', tables.map(t => t.table_name));

        const count = await User.count().catch(err => {
            console.log('❌ User.count() failed:', err.message);
            return -1;
        });
        console.log('User count:', count);

        if (count === -1) {
            console.log('🔄 Attempting force sync...');
            await sequelize.sync({ force: false }); // Use alter: true or force: false
            console.log('✅ Sync call finished');
        }
    } catch (err) {
        console.error('💥 Error:', err);
    } finally {
        process.exit();
    }
}

check();
=======
const { sequelize } = require('../src/config/database');
const { User } = require('../src/models/pg/index');

async function check() {
    try {
        await sequelize.authenticate();
        console.log('✅ Auth success');

        const [tables] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
        console.log('Existing Tables:', tables.map(t => t.table_name));

        const count = await User.count().catch(err => {
            console.log('❌ User.count() failed:', err.message);
            return -1;
        });
        console.log('User count:', count);

        if (count === -1) {
            console.log('🔄 Attempting force sync...');
            await sequelize.sync({ force: false }); // Use alter: true or force: false
            console.log('✅ Sync call finished');
        }
    } catch (err) {
        console.error('💥 Error:', err);
    } finally {
        process.exit();
    }
}

check();
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
