// Script to create Admin User: chhotu.singh@jaipur.manipal.edu
const bcrypt = require('bcryptjs');
const { sequelize } = require('./src/config/database');
const User = require('./src/models/pg/User');
const AdminProfile = require('./src/models/pg/AdminProfile');

async function createAdminUser() {
    try {
        // Connect to database
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Sync models
        await sequelize.sync();
        console.log('✅ Models synced');

        // Check if user already exists
        const existingUser = await User.findOne({
            where: { email: 'chhotu.singh@jaipur.manipal.edu' }
        });

        if (existingUser) {
            console.log('⚠️ User already exists!');
            console.log('Email:', existingUser.email);
            console.log('Role:', existingUser.role);
            console.log('Approved:', existingUser.isApproved);
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('chhotu.singh', 10);

        // Create admin user
        const adminUser = await User.create({
            email: 'chhotu.singh@jaipur.manipal.edu',
            password: hashedPassword,
            name: 'Chhotu Singh',
            role: 'admin',
            isApproved: true,
            isActive: true,
            isPasswordChanged: false
        });

        console.log('✅ Admin user created successfully!');
        console.log('Email:', adminUser.email);
        console.log('User ID:', adminUser.id);

        // Create admin profile
        const adminProfile = await AdminProfile.create({
            userId: adminUser.id,
            accessLevel: 'SUPER_ADMIN'
        });

        console.log('✅ Admin profile created!');
        console.log('Access Level:', adminProfile.accessLevel);

        console.log('\n🎉 Admin user setup complete!');
        console.log('📧 Username: chhotu.singh@jaipur.manipal.edu');
        console.log('🔑 Password: chhotu.singh');
        console.log('✅ Approved: true');
        console.log('🚀 Ready to login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser();
