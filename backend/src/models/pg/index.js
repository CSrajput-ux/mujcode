// File: src/models/pg/index.js
const User = require('./User');
const StudentProfile = require('./StudentProfile');
const FacultyProfile = require('./FacultyProfile');
const CompanyProfile = require('./CompanyProfile');
const AdminProfile = require('./AdminProfile');


// Associations (Rishta jodna)
// User has One Profile
User.hasOne(StudentProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
StudentProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(FacultyProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
FacultyProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(CompanyProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
CompanyProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(AdminProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
AdminProfile.belongsTo(User, { foreignKey: 'userId' });

const { Department, Program, Branch, Subject, Section, AcademicYear } = require('./UniversityStructure');
const { StudentEnrollment, FacultyAllocation } = require('./UniversityAssociations');
const { AdministrativeRole, RoleAssignment } = require('./AdminModule');
const { Company, PlacementDrive, JobPosting, StudentApplication } = require('./PlacementModule');

module.exports = {
    User,
    StudentProfile,
    FacultyProfile,
    CompanyProfile,
    AdminProfile,
    // University Structure
    Department, Program, Branch, Subject, Section, AcademicYear,
    // Associations
    StudentEnrollment, FacultyAllocation,
    // Admin
    AdministrativeRole, RoleAssignment,
    // Placement
    Company, PlacementDrive, JobPosting, StudentApplication
};