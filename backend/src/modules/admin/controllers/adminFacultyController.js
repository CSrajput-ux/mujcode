const Faculty = require('../../../models/mongo/Faculty');
const Course = require('../../../models/mongo/Course');
const { User } = require('../../../models/pg');
const bcrypt = require('bcryptjs');

/**
 * GET /api/admin/faculty
 * Get paginated list of faculty with search
 */
exports.getFaculty = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search = '',
            department = ''
        } = req.query;

        const query = {};

        // Search by name, email, or faculty ID
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { facultyId: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by department
        if (department) {
            query.department = department;
        }

        const total = await Faculty.countDocuments(query);
        const faculty = await Faculty.find(query)
            .populate('teachingCourses', 'title category')
            .populate('createdCourses', 'title category')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                faculty,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Error fetching faculty:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch faculty'
        });
    }
};

/**
 * POST /api/admin/faculty
 * Create new faculty member
 */
exports.createFaculty = async (req, res) => {
    try {
        const {
            name,
            email,
            facultyId,
            department,
            departmentId,
            designation,
            password
        } = req.body;


        // Validate required fields
        if (!name || !email || !facultyId || !department || !password) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, faculty ID, department, and password are required'
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Email already exists'
            });
        }

        // Check if faculty ID already exists
        const existingFacultyId = await Faculty.findOne({ facultyId });
        if (existingFacultyId) {
            return res.status(400).json({
                success: false,
                error: 'Faculty ID already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User in PostgreSQL
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'faculty',
            isApproved: true,
            isActive: true
        });

        // Create Faculty in MongoDB
        const faculty = await Faculty.create({
            userId: user.id,
            name,
            email,
            facultyId,
            department,
            departmentId,
            designation: designation || 'Assistant Professor',

            teachingAssignments: [],
            teachingCourses: [],
            createdCourses: []
        });

        // Log activity (fire and forget)
        const { logFacultyAdded } = require('../../../middlewares/activityLogger');
        logFacultyAdded(faculty._id, email, name, department).catch(err => {
            console.error('Failed to log faculty addition:', err);
        });

        res.status(201).json({
            success: true,
            message: 'Faculty created successfully',
            data: faculty
        });
    } catch (error) {
        console.error('Error creating faculty:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create faculty'
        });
    }
};

/**
 * POST /api/admin/faculty/assign-courses
 * Assign courses to faculty member
 */
exports.assignCourses = async (req, res) => {
    try {
        const { facultyId, courseIds } = req.body;

        if (!facultyId || !courseIds || !Array.isArray(courseIds)) {
            return res.status(400).json({
                success: false,
                error: 'Faculty ID and course IDs array are required'
            });
        }

        // Find faculty
        const faculty = await Faculty.findById(facultyId);
        if (!faculty) {
            return res.status(404).json({
                success: false,
                error: 'Faculty not found'
            });
        }

        // Validate all course IDs exist
        const courses = await Course.find({ _id: { $in: courseIds } });
        if (courses.length !== courseIds.length) {
            return res.status(400).json({
                success: false,
                error: 'One or more invalid course IDs'
            });
        }

        // Update teaching courses
        faculty.teachingCourses = courseIds;
        await faculty.save();

        // Fetch updated faculty with populated courses
        const updatedFaculty = await Faculty.findById(facultyId)
            .populate('teachingCourses', 'title category');

        res.json({
            success: true,
            message: 'Courses assigned successfully',
            data: updatedFaculty
        });
    } catch (error) {
        console.error('Error assigning courses:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to assign courses'
        });
    }
};

/**
 * PUT /api/admin/faculty/:id
 * Update faculty details
 */
exports.updateFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            email,
            department,
            designation,
            teachingAssignments
        } = req.body;

        // Find faculty
        const faculty = await Faculty.findById(id);
        if (!faculty) {
            return res.status(404).json({
                success: false,
                error: 'Faculty not found'
            });
        }

        // Check email uniqueness if changing
        if (email && email !== faculty.email) {
            const existingFaculty = await Faculty.findOne({
                email,
                _id: { $ne: id }
            });
            if (existingFaculty) {
                return res.status(400).json({
                    success: false,
                    error: 'Email already exists'
                });
            }

            // Also update User email
            await User.update(
                { email },
                { where: { id: faculty.userId } }
            );
        }

        // Update name in User table if changed
        if (name && name !== faculty.name) {
            await User.update(
                { name },
                { where: { id: faculty.userId } }
            );
        }

        // Update faculty document
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (department) updateData.department = department;
        if (designation) updateData.designation = designation;
        if (teachingAssignments) updateData.teachingAssignments = teachingAssignments;

        await Faculty.findByIdAndUpdate(id, updateData);

        // Fetch updated faculty
        const updatedFaculty = await Faculty.findById(id)
            .populate('teachingCourses', 'title category');

        res.json({
            success: true,
            message: 'Faculty updated successfully',
            data: updatedFaculty
        });
    } catch (error) {
        console.error('Error updating faculty:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update faculty'
        });
    }
};

/**
 * DELETE /api/admin/faculty/:id
 * Delete (deactivate) faculty member
 */
exports.deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;

        // Find faculty
        const faculty = await Faculty.findById(id);
        if (!faculty) {
            return res.status(404).json({
                success: false,
                error: 'Faculty not found'
            });
        }

        // Deactivate user in PostgreSQL
        await User.update(
            { isActive: false },
            { where: { id: faculty.userId } }
        );

        res.json({
            success: true,
            message: 'Faculty deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting faculty:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete faculty'
        });
    }
};

/**
 * GET /api/admin/faculty/:id
 * Get single faculty details
 */
exports.getFacultySingle = async (req, res) => {
    try {
        const { id } = req.params;

        const faculty = await Faculty.findById(id)
            .populate('teachingCourses', 'title category')
            .populate('createdCourses', 'title category');

        if (!faculty) {
            return res.status(404).json({
                success: false,
                error: 'Faculty not found'
            });
        }

        res.json({
            success: true,
            data: faculty
        });
    } catch (error) {
        console.error('Error fetching faculty:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch faculty'
        });
    }
};
