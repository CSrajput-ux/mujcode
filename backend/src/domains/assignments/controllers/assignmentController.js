const Assignment = require('../models/mongo/Assignment');
const AssignmentSubmission = require('../models/mongo/AssignmentSubmission');

// Create a new assignment
exports.createAssignment = async (req, res) => {
    try {
        const { title, description, type, subject, year, branch, section, dueDate, totalMarks } = req.body;
        const newAssignment = new Assignment({
            title, description, type, subject, year, branch, section, dueDate, totalMarks,
            createdBy: 'FACULTY_ID_MOCK' // Replace with req.user.id in prod
        });
        await newAssignment.save();
        res.status(201).json(newAssignment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating assignment', error: error.message });
    }
};

// Get all assignments (Faculty View - can limit by Creator ID later)
exports.getFacultyAssignments = async (req, res) => {
    try {
        // Simple fetch all for MVP. Add filters (req.query) as needed.
        const assignments = await Assignment.find().sort({ createdAt: -1 });

        // Enhance with stats (Completed vs Pending)
        const enhanced = await Promise.all(assignments.map(async (a) => {
            const totalSubmissions = await AssignmentSubmission.countDocuments({ assignmentId: a._id });
            // Mock total students count per section logic or hardcode for now
            const totalStudents = 50; // Mock class size
            return {
                ...a.toObject(),
                completedCount: totalSubmissions,
                pendingCount: Math.max(0, totalStudents - totalSubmissions),
                totalStudents
            };
        }));

        res.json(enhanced);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assignments', error: error.message });
    }
};

// Get submissions for a specific assignment
exports.getAssignmentSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const submissions = await AssignmentSubmission.find({ assignmentId });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submissions', error: error.message });
    }
};

// Grade a submission
exports.gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { marks, feedback } = req.body;

        const submission = await AssignmentSubmission.findByIdAndUpdate(
            submissionId,
            { marks, feedback, status: 'Graded' },
            { new: true }
        );
        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error grading submission', error: error.message });
    }
};

// SEED Helper (called from frontend for demo)
exports.seedAssignments = async (req, res) => {
    try {
        // Clear existing for clean demo
        // await Assignment.deleteMany({});
        // await AssignmentSubmission.deleteMany({});

        const sampleAssignments = [
            { title: "Data Structures Lab 1", subject: "DSA", type: "Assignment", year: "2", section: "A", dueDate: new Date() },
            { title: "AI Case Study: Ethics", subject: "AI", type: "CaseStudy", year: "3", section: "B", dueDate: new Date() },
            { title: "Blockchain Research Paper", subject: "Blockchain", type: "Research", year: "4", section: "A", dueDate: new Date() }
        ];

        const docs = await Assignment.insertMany(sampleAssignments);
        res.json({ message: 'Seeded successfully', count: docs.length });
    } catch (error) {
        res.status(500).json({ message: 'Error seeding', error: error.message });
    }
};
