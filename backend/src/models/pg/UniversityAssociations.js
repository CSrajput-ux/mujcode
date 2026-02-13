const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const { Section, Subject, AcademicYear } = require('./UniversityStructure');
const User = require('./User'); // Assuming User model is here

const StudentEnrollment = sequelize.define('StudentEnrollment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    studentId: { type: DataTypes.UUID, references: { model: User, key: 'id' } },
    sectionId: { type: DataTypes.INTEGER, references: { model: Section, key: 'id' } },
    academicYearId: { type: DataTypes.INTEGER, references: { model: AcademicYear, key: 'id' } },
    status: { type: DataTypes.STRING, defaultValue: 'Active' } // Active, Detained, Alumni
});

const FacultyAllocation = sequelize.define('FacultyAllocation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    facultyId: { type: DataTypes.UUID, references: { model: User, key: 'id' } },
    subjectId: { type: DataTypes.INTEGER, references: { model: Subject, key: 'id' } },
    sectionId: { type: DataTypes.INTEGER, references: { model: Section, key: 'id' } },
    academicYearId: { type: DataTypes.INTEGER, references: { model: AcademicYear, key: 'id' } }
});

// Relationships
StudentEnrollment.belongsTo(Section, { foreignKey: 'sectionId' });
Section.hasMany(StudentEnrollment, { foreignKey: 'sectionId' });

StudentEnrollment.belongsTo(AcademicYear, { foreignKey: 'academicYearId' });

FacultyAllocation.belongsTo(Subject, { foreignKey: 'subjectId' });
FacultyAllocation.belongsTo(Section, { foreignKey: 'sectionId' });
FacultyAllocation.belongsTo(AcademicYear, { foreignKey: 'academicYearId' });

module.exports = { StudentEnrollment, FacultyAllocation };
