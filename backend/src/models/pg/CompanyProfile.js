// File: src/models/pg/CompanyProfile.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('./User');

const CompanyProfile = sequelize.define('CompanyProfile', {
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
    companyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    website: {
        type: DataTypes.STRING
    },
    hrContact: {
        type: DataTypes.STRING
    }
});

module.exports = CompanyProfile;