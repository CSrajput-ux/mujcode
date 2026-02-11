const mongoose = require('mongoose');
const Faculty = require('./src/models/mongo/Faculty');
const Course = require('./src/models/mongo/Course');
const PermissionRequest = require('./src/models/mongo/PermissionRequest');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';

const seedPermissions = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // 1. Cleanup
        await Faculty.deleteMany({ email: /test-faculty/ });
        await Course.deleteMany({ title: /Test Permission Course/ });
        // We don't delete all permission requests to avoid clearing real data, but we'll clear test ones
        await PermissionRequest.deleteMany({ section: 'X-TEST' });

        // 2. Create a Test Course
        const testCourse = await Course.create({
            title: 'Test Permission Course (ABAC)',
            department: 'Computer Science',
            sectionsAllowed: ['A', 'B', 'X-TEST'],
            createdByFacultyId: 'faculty-123', // Matches Faculty A
            description: 'A course to test permissions logic.',
            category: 'DSA',
            difficulty: 'Medium'
        });

        // 3. Create Faculty A (The "Allowed" Faculty)
        const facultyA = await Faculty.create({
            userId: 'faculty-123',
            name: 'Dr. Muj Code',
            email: 'test-faculty-a@muj.edu',
            facultyId: 'FAC001',
            department: 'Computer Science',
            designation: 'Senior Professor',
            teachingAssignments: [
                { year: '3rd Year', section: 'A', branch: 'CSE', subject: 'DSA' },
                { year: '3rd Year', section: 'X-TEST', branch: 'CSE', subject: 'Testing' }
            ],
            teachingCourses: [testCourse._id],
            createdCourses: [testCourse._id]
        });

        // 4. Create Faculty B (The "Blocked" Faculty - Different Section)
        const facultyB = await Faculty.create({
            userId: 'faculty-999',
            name: 'Prof. Blocked',
            email: 'test-faculty-b@muj.edu',
            facultyId: 'FAC999',
            department: 'Computer Science',
            designation: 'Assistant Professor',
            teachingAssignments: [
                { year: '1st Year', section: 'C', branch: 'CSE', subject: 'Basic C' }
            ],
            teachingCourses: [],
            createdCourses: []
        });

        // 5. Create Sample Requests
        const requests = [
            {
                studentId: 'STU_001_A',
                courseId: testCourse._id,
                section: 'A', // Should be manageable by Faculty A
                status: 'pending'
            },
            {
                studentId: 'STU_002_X',
                courseId: testCourse._id,
                section: 'X-TEST', // Should be manageable by Faculty A
                status: 'pending'
            },
            {
                studentId: 'STU_003_C',
                courseId: testCourse._id,
                section: 'C', // Should NOT be manageable by Faculty A (Section mismatch)
                status: 'pending'
            }
        ];

        await PermissionRequest.insertMany(requests);

        console.log('✅ Seed successful!');
        console.log('Faculty A (ID: faculty-123) can manage Section A and X-TEST.');
        console.log('Request for Section C will be VIEWABLE but NOT MANAGEABLE by Faculty A.');

        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedPermissions();
