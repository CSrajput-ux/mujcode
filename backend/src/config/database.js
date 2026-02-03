// File: src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Unified Database Connection (PostgreSQL)
// This will be the "Brain" connecting all dashboards.
const sequelize = new Sequelize(
    process.env.POSTGRES_DB || 'mujcode',
    process.env.POSTGRES_USER || 'admin',
    process.env.POSTGRES_PASSWORD || 'admin',
    {
        host: process.env.POSTGRES_HOST || 'localhost',
        dialect: 'postgres',
        logging: false, // Keep console clean for performance
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Unified Database Connected (PostgreSQL).');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, connectDB };
