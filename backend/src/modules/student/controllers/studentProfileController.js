// File: src/controllers/studentProfileController.js
const StudentProfile = require('../../../models/pg/StudentProfile');
const User = require('../../../models/pg/User');
const { StudentEnrollment } = require('../../../models/pg/UniversityAssociations');
const { Section, Branch, Program, Department } = require('../../../models/pg/UniversityStructure');

// Update student profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Identification via JWT token
        const { section, branch, year, semester, course, department } = req.body;

        // Security: Prevent updating sensitive fields like email or rollNumber
        // We only pick what is allowed from req.body

        // Find student profile
        let profile = await StudentProfile.findOne({ where: { userId } });

        if (!profile) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        // Update profile - Whitelisted fields only
        if (section !== undefined) profile.section = section;
        if (branch !== undefined) profile.branch = branch;
        if (year !== undefined) profile.year = year;
        if (semester !== undefined) profile.semester = semester;
        if (course !== undefined) profile.course = course;
        if (department !== undefined) profile.department = department;
        if (req.body.school !== undefined) profile.school = req.body.school;

        await profile.save();

        // Relational ERP Update
        const { sectionId, branchId, academicYearId } = req.body;
        if (sectionId || branchId || academicYearId) {
            const defaults = { status: 'Active' };
            if (sectionId) defaults.sectionId = sectionId;
            if (academicYearId) defaults.academicYearId = academicYearId;

            await StudentEnrollment.findOrCreate({
                where: { studentId: userId },
                defaults: {
                    ...defaults,
                    studentId: userId
                }
            }).then(async ([enrollment, created]) => {
                if (!created) {
                    await enrollment.update(defaults);
                }
            });

            // If branchId is provided, we can auto-update the legacy 'branch' string if it's empty
            if (branchId && !profile.branch) {
                const b = await Branch.findByPk(branchId);
                if (b) {
                    profile.branch = b.name;
                    await profile.save();
                }
            }
        }


        res.status(200).json({
            message: 'Profile updated successfully',
            profile: {
                section: profile.section,
                branch: profile.branch,
                year: profile.year,
                semester: profile.semester,
                course: profile.course,
                department: profile.department
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get student profile
exports.getProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`[DEBUG] getProfile called for userId: ${userId}`);

        const profile = await StudentProfile.findOne({
            where: { userId },
            include: [{ model: User, attributes: ['name', 'email', 'role'] }]
        });

        console.log(`[DEBUG] Profile found: ${profile ? 'YES' : 'NO'}`);

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Fetch Academic Enrollment (New ERP Structure)
        const enrollment = await StudentEnrollment.findOne({
            where: { studentId: userId, status: 'Active' },
            include: [
                {
                    model: Section,
                    include: [
                        {
                            model: Branch,
                            include: [
                                { model: Program, include: [Department] }
                            ]
                        }
                    ]
                }
            ]
        });

        const responseData = profile.toJSON();

        if (enrollment) {
            const section = enrollment.Section;
            const branch = section.Branch;
            const program = branch.Program;
            const dept = program.Department;

            // Enhance/Override legacy fields with Relation Data
            responseData.academicDetails = {
                section: section.name,
                branch: branch.name,
                branchCode: branch.code,
                program: program.name,
                department: dept.name,
                currentSemester: section.currentSemester
            };

            // Backwards compatibility for frontend
            responseData.section = section.name;
            responseData.branch = branch.code;
            responseData.department = dept.code;
        }

        res.status(200).json({ profile: responseData });
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = exports;
