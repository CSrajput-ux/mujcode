const { sequelize } = require('./src/config/database');
const User = require('./src/models/pg/User');
const StudentProfile = require('./src/models/pg/StudentProfile');
const FacultyProfile = require('./src/models/pg/FacultyProfile');
const CompanyProfile = require('./src/models/pg/CompanyProfile');
const AdminProfile = require('./src/models/pg/AdminProfile');

try {
    console.log("--- Student ---");
    User.hasOne(StudentProfile, { foreignKey: 'userId' });
    StudentProfile.belongsTo(User, { foreignKey: 'userId' });
    console.log("Student OK");

    console.log("--- Faculty ---");
    User.hasOne(FacultyProfile, { foreignKey: 'userId' });
    FacultyProfile.belongsTo(User, { foreignKey: 'userId' });
    console.log("Faculty OK");

    console.log("--- Company ---");
    User.hasOne(CompanyProfile, { foreignKey: 'userId' });
    CompanyProfile.belongsTo(User, { foreignKey: 'userId' });
    console.log("Company OK");

    console.log("--- Admin ---");
    User.hasOne(AdminProfile, { foreignKey: 'userId' });
    AdminProfile.belongsTo(User, { foreignKey: 'userId' });
    console.log("Admin OK");

} catch (e) {
    console.error("FAIL:", e);
}
