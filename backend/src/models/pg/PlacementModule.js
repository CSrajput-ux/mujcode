const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('./User'); // Recruiters are Users
const { Program, Branch, AcademicYear } = require('./UniversityStructure');

const Company = sequelize.define('Company', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    industry: { type: DataTypes.STRING },
    website: { type: DataTypes.STRING },
    hrContactName: { type: DataTypes.STRING },
    hrContactEmail: { type: DataTypes.STRING },
    logoUrl: { type: DataTypes.STRING }
});

const PlacementDrive = sequelize.define('PlacementDrive', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false }, // e.g., "Microsoft 2026 Campus Drive"
    companyId: { type: DataTypes.INTEGER, references: { model: Company, key: 'id' } },
    academicYearId: { type: DataTypes.INTEGER, references: { model: AcademicYear, key: 'id' } },
    driveDate: { type: DataTypes.DATE },
    status: { type: DataTypes.ENUM('Scheduled', 'Ongoing', 'Completed', 'Cancelled'), defaultValue: 'Scheduled' },
    description: { type: DataTypes.TEXT }
});

const JobPosting = sequelize.define('JobPosting', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    driveId: { type: DataTypes.INTEGER, references: { model: PlacementDrive, key: 'id' } },
    role: { type: DataTypes.STRING, allowNull: false }, // e.g., "SDE-1"
    ctc: { type: DataTypes.STRING }, // e.g., "15 LPA"
    ctcValue: { type: DataTypes.INTEGER }, // Numeric for filtering (e.g., 1500000)
    locations: { type: DataTypes.STRING }, // "Bangalore, Hyderabad"
    eligibilityCriteria: { type: DataTypes.JSONB }, // { minCGPA: 7.5, allowedBranches: ['CSE', 'IT'] }
    status: { type: DataTypes.ENUM('Open', 'Closed'), defaultValue: 'Open' }
});

const StudentApplication = sequelize.define('StudentApplication', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    jobId: { type: DataTypes.INTEGER, references: { model: JobPosting, key: 'id' } },
    studentId: { type: DataTypes.UUID, references: { model: User, key: 'id' } },
    status: { type: DataTypes.ENUM('Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'), defaultValue: 'Applied' },
    resumeUrl: { type: DataTypes.STRING },
    appliedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// Relationships
Company.hasMany(PlacementDrive, { foreignKey: 'companyId' });
PlacementDrive.belongsTo(Company, { foreignKey: 'companyId' });

PlacementDrive.hasMany(JobPosting, { foreignKey: 'driveId' });
JobPosting.belongsTo(PlacementDrive, { foreignKey: 'driveId' });

JobPosting.hasMany(StudentApplication, { foreignKey: 'jobId' });
StudentApplication.belongsTo(JobPosting, { foreignKey: 'jobId' });

// We should also link User (Student) to Application, but assume defined in User.js or here
StudentApplication.belongsTo(User, { foreignKey: 'studentId' });

module.exports = { Company, PlacementDrive, JobPosting, StudentApplication };
