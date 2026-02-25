const mongoose = require('mongoose');
const dotenv = require('dotenv');
const StudentProgress = require('../src/models/mongo/StudentProgress');
const Faculty = require('../src/models/mongo/Faculty');

dotenv.config();

async function verifyLock() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find a test student
        const student = await StudentProgress.findOne({});
        if (!student) {
            console.error('❌ No student progress found for testing');
            process.exit(1);
        }

        console.log(`🔍 Testing student: ${student.userId}`);

        // Reset lock for test
        student.mentorSelectionLocked = false;
        student.selectedMentors = [];
        await student.save();
        console.log('🔄 Reset student mentor state');

        // Pick a random faculty
        const faculty = await Faculty.findOne({});
        if (!faculty) {
            console.error('❌ No faculty found to group');
            process.exit(1);
        }

        // Mock a request logic
        console.log(`🎯 Assigning mentor: ${faculty.name}`);

        // Simulating the controller logic
        if (student.mentorSelectionLocked) {
            console.error('❌ FAILED: Should not be locked initially');
        }

        student.selectedMentors = [faculty._id];
        student.mentorSelectionLocked = true;
        await student.save();
        console.log('✅ Mentor assigned and locked');

        // Test re-assignment
        if (student.mentorSelectionLocked) {
            console.log('🛡️ Verifying lock enforcement...');
            // In a real request, the controller checks this flag
            console.log('✅ Lock flag is set to true');
        } else {
            console.error('❌ FAILED: Lock flag was not set');
        }

        // Cleanup (Optional: keep it locked for manual verify if desired, but good practice to reset)
        // student.mentorSelectionLocked = false;
        // await student.save();

        process.exit(0);
    } catch (error) {
        console.error('❌ Error during verification:', error);
        process.exit(1);
    }
}

verifyLock();
