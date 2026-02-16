// File: src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Unified Database Connection (PostgreSQL)
console.log(`📡 Connecting to ${process.env.PG_HOST ? 'PostgreSQL' : 'SQLite'}...`);
const sequelize = process.env.PG_HOST ? new Sequelize(
    process.env.PG_DATABASE,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        dialect: 'postgres',
        logging: false
    }
) : new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});


const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`✅ Database Connected to ${sequelize.options.dialect.toUpperCase()}.`);
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, connectDB };
