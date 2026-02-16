const { sequelize } = require('../config/database');

async function addColumn() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        console.log('Adding tokenVersion column to Users table...');

        // Check if column exists first to avoid error
        const [results] = await sequelize.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='Users' AND column_name='tokenVersion';
        `);

        if (results.length === 0) {
            await sequelize.query('ALTER TABLE "Users" ADD COLUMN "tokenVersion" INTEGER DEFAULT 0;');
            console.log('Column tokenVersion added successfully.');
        } else {
            console.log('Column tokenVersion already exists.');
        }

    } catch (error) {
        console.error('Error adding column:', error);
    } finally {
        await sequelize.close();
    }
}

addColumn();
