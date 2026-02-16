// Script to update chhotu.singh@jaipur.manipal.edu from faculty to admin
const bcrypt = require('bcryptjs');
const { sequelize } = require('./src/config/database');
const User = require('./src/models/pg/User');
const AdminProfile = require('./src/models/pg/AdminProfile');
const FacultyProfile = require('./src/models/pg/FacultyProfile');

async function updateToAdmin() {
    try {
        // Connect to database
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Sync models
        await sequelize.sync();
        console.log('✅ Models synced');

        // Find the user
        const user = await User.findOne({
            where: { email: 'chhotu.singh@jaipur.manipal.edu' }
        });

        if (!user) {
            console.log('❌ User not found!');
            process.exit(1);
        }

        console.log('📋 Current user details:');
        console.log('Email:', user.email);
        console.log('Name:', user.name);
        console.log('Role:', user.role);
        console.log('Approved:', user.isApproved);

        // Update password if needed
        const newHashedPassword = await bcrypt.hash('chhotu.singh', 10);

        // Update user to admin role
        await user.update({
            role: 'admin',
            password: newHashedPassword,
            isApproved: true,
            isActive: true
        });

        console.log('\n✅ User updated to admin role!');

        // Delete faculty profile if exists
        await FacultyProfile.destroy({ where: { userId: user.id } });
        console.log('✅ Faculty profile removed');

        // Create or update admin profile
        const [adminProfile, created] = await AdminProfile.findOrCreate({
            where: { userId: user.id },
            defaults: {
                userId: user.id,
                accessLevel: 'SUPER_ADMIN'
            }
        });

        if (created) {
            console.log('✅ Admin profile created!');
        } else {
            console.log('ℹ️  Admin profile already exists');
        }

        console.log('\n🎉 Update complete!');
        console.log('📧 Username: chhotu.singh@jaipur.manipal.edu');
        console.log('🔑 Password: chhotu.singh');
        console.log('👤 Role: admin');
        console.log('✅ Access Level: SUPER_ADMIN');
        console.log('🚀 Ready to login to admin dashboard!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating user:', error);
        process.exit(1);
    }
}

updateToAdmin();
