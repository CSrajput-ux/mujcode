// File: src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Unified Database Connection (PostgreSQL)
// This will be the "Brain" connecting all dashboards.
// SQLite Connection (Fallback for Dev)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // File will be created in backend root
    logging: false
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Unified Database Connected (SQLite).');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, connectDB };
