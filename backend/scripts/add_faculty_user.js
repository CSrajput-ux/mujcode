
const bcrypt = require('bcryptjs');
const { sequelize } = require('./src/config/database');
const User = require('./src/models/pg/User');
const FacultyProfile = require('./src/models/pg/FacultyProfile');

async function createFacultyUser() {
    try {
        // Connect to database
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Sync models
        await sequelize.sync();
        console.log('✅ Models synced');

        const email = 'dr.rishi.gupta@jaipur.manipal.edu';

        // Check if user already exists
        const existingUser = await User.findOne({
            where: { email: email }
        });

        if (existingUser) {
            console.log('⚠️ User already exists!');
            console.log('Email:', existingUser.email);
            // check if profile exists
            const existingProfile = await FacultyProfile.findOne({ where: { userId: existingUser.id } });
            if (!existingProfile) {
                console.log('⚠️ User exists but profile missing. Creating profile...');
                await FacultyProfile.create({
                    userId: existingUser.id,
                    employeeId: 'FAC-' + Date.now(), // Generate unique employee ID
                    department: 'Computer Science', // Default department
                    designation: 'Professor' // Default designation
                });
                console.log('✅ Faculty profile created for existing user!');
            }
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('dr.rishi.gupta', 10);

        // Create faculty user
        const facultyUser = await User.create({
            email: email,
            password: hashedPassword,
            name: 'Dr. Rishi Gupta',
            role: 'faculty',
            isApproved: true,
            isActive: true,
            isPasswordChanged: false
        });

        console.log('✅ Faculty user created successfully!');
        console.log('Email:', facultyUser.email);

        // Create faculty profile
        const facultyProfile = await FacultyProfile.create({
            userId: facultyUser.id,
            employeeId: 'FAC-' + Date.now(),
            department: 'Computer Science',
            designation: 'Professor'
        });

        console.log('✅ Faculty profile created!');
        console.log('Employee ID:', facultyProfile.employeeId);

        console.log('\n🎉 Faculty user setup complete!');
        console.log(`📧 Email: ${email}`);
        console.log('🔑 Password: dr.rishi.gupta');
        console.log('✅ Approved: true');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating faculty user:', error);
        process.exit(1);
    }
}

createFacultyUser();
