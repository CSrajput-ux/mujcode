<<<<<<< HEAD
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('./User');
const { Department } = require('./UniversityStructure');

const AdministrativeRole = sequelize.define('AdministrativeRole', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }, // e.g., "HOD", "Dean", "ExamCell"
    permissions: { type: DataTypes.JSONB } // { canViewGrades: true, canApproveLeave: true }
});

const RoleAssignment = sequelize.define('RoleAssignment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.UUID, references: { model: User, key: 'id' } },
    roleId: { type: DataTypes.INTEGER, references: { model: AdministrativeRole, key: 'id' } },
    scopeType: { type: DataTypes.ENUM('University', 'Faculty', 'Department'), defaultValue: 'University' },
    scopeId: { type: DataTypes.INTEGER }, // ID of Dept or Faculty if applicable
    departmentId: { type: DataTypes.INTEGER, references: { model: Department, key: 'id' } } // Explicit link for HODs
});

// Relationships
AdministrativeRole.hasMany(RoleAssignment, { foreignKey: 'roleId' });
RoleAssignment.belongsTo(AdministrativeRole, { foreignKey: 'roleId' });

RoleAssignment.belongsTo(User, { foreignKey: 'userId' });
RoleAssignment.belongsTo(Department, { foreignKey: 'departmentId' });

module.exports = { AdministrativeRole, RoleAssignment };
=======
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('./User');
const { Department } = require('./UniversityStructure');

const AdministrativeRole = sequelize.define('AdministrativeRole', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }, // e.g., "HOD", "Dean", "ExamCell"
    permissions: { type: DataTypes.JSONB } // { canViewGrades: true, canApproveLeave: true }
});

const RoleAssignment = sequelize.define('RoleAssignment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.UUID, references: { model: User, key: 'id' } },
    roleId: { type: DataTypes.INTEGER, references: { model: AdministrativeRole, key: 'id' } },
    scopeType: { type: DataTypes.ENUM('University', 'Faculty', 'Department'), defaultValue: 'University' },
    scopeId: { type: DataTypes.INTEGER }, // ID of Dept or Faculty if applicable
    departmentId: { type: DataTypes.INTEGER, references: { model: Department, key: 'id' } } // Explicit link for HODs
});

// Relationships
AdministrativeRole.hasMany(RoleAssignment, { foreignKey: 'roleId' });
RoleAssignment.belongsTo(AdministrativeRole, { foreignKey: 'roleId' });

RoleAssignment.belongsTo(User, { foreignKey: 'userId' });
RoleAssignment.belongsTo(Department, { foreignKey: 'departmentId' });

module.exports = { AdministrativeRole, RoleAssignment };
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
