// File: src/models/pg/AdminProfile.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('./User');

const AdminProfile = sequelize.define('AdminProfile', {
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
    accessLevel: {
        type: DataTypes.STRING,
        defaultValue: 'SUPER_ADMIN'
    }
});

module.exports = AdminProfile;
