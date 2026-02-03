// File: src/models/pg/FacultyProfile.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('./User');

const FacultyProfile = sequelize.define('FacultyProfile', {
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
    employeeId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    department: {
        type: DataTypes.STRING, // e.g., CSE, Mechanical
        allowNull: false
    },
    designation: {
        type: DataTypes.STRING // e.g., HOD, Assistant Professor
    }
});

module.exports = FacultyProfile;