// File: src/controllers/facultyController.js
const Faculty = require('../models/mongo/Faculty');
const { User, FacultyProfile } = require('../models/pg');

exports.updateFacultyProfile = async (req, res) => {
    try {
        const { facultyId } = req.params; // This is the userId from Postgres
        const { department, designation, teachingAssignments } = req.body;

        // Security: Ensure user is editing their own profile (from token)
        if (req.user.id !== facultyId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized to update this profile' });
        }

        // Fetch user details from Postgres to ensure permanent fields stay intact
        const pgUser = await User.findByPk(facultyId, {
            include: [{ model: FacultyProfile }]
        });

        if (!pgUser) return res.status(404).json({ error: 'Faculty not found' });

        const email = pgUser.email;
        const name = pgUser.name;
        const employeeId = pgUser.FacultyProfile ? pgUser.FacultyProfile.employeeId : 'N/A';

        // Update or Create in MongoDB
        const faculty = await Faculty.findOneAndUpdate(
            { userId: facultyId },
            {
                userId: facultyId,
                name,
                email,
                facultyId: employeeId,
                department,
                designation,
                teachingAssignments
            },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Faculty profile updated successfully',
            data: faculty
        });

    } catch (error) {
        console.error('Update Faculty Error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getTeachingMap = async (req, res) => {
    try {
        const { year, section, branch } = req.query;

        if (!year || !section || !branch) {
            return res.status(400).json({ error: 'Missing parameters: year, section, and branch are required' });
        }

        // Find all faculty teaching this specific combo
        // MongoDB query into nested array
        const results = await Faculty.find({
            teachingAssignments: {
                $elemMatch: {
                    year: year,
                    section: section,
                    branch: branch
                }
            }
        }).select('name designation department teachingAssignments');

        // Filter assignments to only show the relevant ones for this student context
        const mappedData = results.map(f => {
            const relevantAssignments = f.teachingAssignments.filter(a =>
                a.year === year && a.section === section && a.branch === branch
            );
            return {
                facultyName: f.name,
                designation: f.designation,
                department: f.department,
                subjects: relevantAssignments.map(ra => ra.subject)
            };
        });

        res.status(200).json(mappedData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFacultyProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const faculty = await Faculty.findOne({ userId });

        if (!faculty) {
            // Fallback to basic PG data if not in Mongo yet
            const pgUser = await User.findByPk(userId, { include: [FacultyProfile] });
            if (!pgUser) return res.status(404).json({ error: 'Not found' });

            return res.status(200).json({
                name: pgUser.name,
                email: pgUser.email,
                facultyId: pgUser.FacultyProfile?.employeeId,
                department: pgUser.FacultyProfile?.department || 'CSE',
                designation: pgUser.FacultyProfile?.designation || 'Faculty',
                teachingAssignments: []
            });
        }

        res.status(200).json(faculty);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
