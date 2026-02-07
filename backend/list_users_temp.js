const { sequelize } = require('./src/config/database');
const User = require('./src/models/pg/User');

const checkUsers = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        const users = await User.findAll();
        console.log(`Found ${users.length} users:`);
        users.forEach(u => console.log(`- ${u.email} (${u.role})`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

checkUsers();
