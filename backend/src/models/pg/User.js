<<<<<<< HEAD
// File: src/models/pg/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database'); // Tumhara existing path

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Tumhara existing UUID logic
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Login Key
        validate: {
            isEmail: true, // Valid email format check karega
            notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('student', 'faculty', 'admin', 'company'),
        defaultValue: 'student',
        allowNull: false
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Security: Admin approval required
        comment: 'Only approved users can login'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    isPasswordChanged: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    tokenVersion: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['email']
        }
    ]
});

=======
// File: src/models/pg/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database'); // Tumhara existing path

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Tumhara existing UUID logic
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Login Key
        validate: {
            isEmail: true, // Valid email format check karega
            notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('student', 'faculty', 'admin', 'company'),
        defaultValue: 'student',
        allowNull: false
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Security: Admin approval required
        comment: 'Only approved users can login'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    isPasswordChanged: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['email']
        }
    ]
});

>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
module.exports = User;