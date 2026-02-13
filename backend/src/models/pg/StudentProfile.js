// File: src/models/pg/StudentProfile.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('./User');

const StudentProfile = sequelize.define('StudentProfile', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: User, key: 'id' }
    },
    rollNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Fast search ke liye
    },
    branch: {
        type: DataTypes.STRING, // e.g., CSE
        allowNull: true
    },

    section: {
        type: DataTypes.STRING // e.g., A, B
    },
    year: {
        type: DataTypes.INTEGER // e.g., 1, 2, 3, 4
    },
    semester: {
        type: DataTypes.INTEGER, // e.g., 1, 2, 3, 4, 5, 6, 7, 8
        allowNull: true
    },
    course: {
        type: DataTypes.STRING,
        allowNull: true
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cgpa: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    }
});

module.exports = StudentProfile;