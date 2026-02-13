const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Department = sequelize.define('Department', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false, unique: true }, // e.g., CSE
    facultyName: { type: DataTypes.STRING } // e.g., FoSTA
});

const Program = sequelize.define('Program', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }, // e.g., B.Tech
    durationYears: { type: DataTypes.INTEGER, defaultValue: 4 },
    departmentId: { type: DataTypes.INTEGER, references: { model: Department, key: 'id' } }
});

const Branch = sequelize.define('Branch', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }, // e.g., Computer Science & Engineering
    code: { type: DataTypes.STRING, allowNull: false }, // e.g., CSE
    programId: { type: DataTypes.INTEGER, references: { model: Program, key: 'id' } }
});

const Subject = sequelize.define('Subject', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING }, // e.g., CS1001
    semester: { type: DataTypes.INTEGER, allowNull: false },
    credits: { type: DataTypes.INTEGER, defaultValue: 3 },
    branchId: { type: DataTypes.INTEGER, references: { model: Branch, key: 'id' } } // Specific strict mapping
});

const AcademicYear = sequelize.define('AcademicYear', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }, // e.g., "2025-2026"
    isCurrent: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const Section = sequelize.define('Section', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }, // e.g., "A", "B"
    branchId: { type: DataTypes.INTEGER, references: { model: Branch, key: 'id' } },
    currentSemester: { type: DataTypes.INTEGER },
    academicYearId: { type: DataTypes.INTEGER, references: { model: AcademicYear, key: 'id' } }
});

// Relationships
Department.hasMany(Program, { foreignKey: 'departmentId' });
Program.belongsTo(Department, { foreignKey: 'departmentId' });

Program.hasMany(Branch, { foreignKey: 'programId' });
Branch.belongsTo(Program, { foreignKey: 'programId' });

Branch.hasMany(Subject, { foreignKey: 'branchId' });
Subject.belongsTo(Branch, { foreignKey: 'branchId' });

Branch.hasMany(Section, { foreignKey: 'branchId' });
Section.belongsTo(Branch, { foreignKey: 'branchId' });

module.exports = { Department, Program, Branch, Subject, AcademicYear, Section };
