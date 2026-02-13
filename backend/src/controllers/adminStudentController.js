const { User, StudentProfile } = require('../models/pg');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Configure multer for CSV uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'));
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

/**
 * GET /api/admin/students
 * Get paginated list of students with search and filters
 */
exports.getStudents = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search = '',
            branch = '',
            year = '',
            section = ''
        } = req.query;

        const where = {};

        // Filter by branch
        if (branch) {
            where.branch = branch;
        }

        // Filter by year
        if (year) {
            where.year = parseInt(year);
        }

        // Filter by section
        if (section) {
            where.section = section;
        }

        // Build search condition for User table
        const userWhere = {};
        if (search) {
            userWhere[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ];
            // Also search in roll number
            where[Op.or] = [
                { rollNumber: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows } = await StudentProfile.findAndCountAll({
            where,
            include: [{
                model: User,
                attributes: ['id', 'name', 'email', 'isActive', 'isApproved', 'createdAt'],
                where: Object.keys(userWhere).length > 0 ? userWhere : undefined
            }],
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                students: rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: count,
                    pages: Math.ceil(count / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch students'
        });
    }
};

/**
 * POST /api/admin/students
 * Create a new student
 */
exports.createStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            rollNumber,
            password,
            branch,
            branchId,
            year,
            section,
            course,
            department
        } = req.body;

        // Validate required fields
        if (!name || !email || !rollNumber || !password || (!branch && !branchId)) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, roll number, password, and branch (or branchId) are required'
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

        // Check if roll number already exists
        const existingRollNumber = await StudentProfile.findOne({ where: { rollNumber } });
        if (existingRollNumber) {
            return res.status(400).json({
                success: false,
                error: 'Roll number already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User first
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'student',
            isApproved: true, // Admin-created students are auto-approved
            isActive: true
        });

        // NEW: If branchId provided, try to fill 'branch' string for legacy
        let finalBranch = branch;
        if (branchId && !finalBranch) {
            const { Branch } = require('../models/pg');
            const branchObj = await Branch.findByPk(branchId);
            if (branchObj) finalBranch = branchObj.name;
        }

        // Create StudentProfile
        const studentProfile = await StudentProfile.create({
            userId: user.id,
            rollNumber,
            branch: finalBranch || null,

            year: year ? parseInt(year) : null,
            section: section || null,
            course: course || null,
            department: department || null
        });

        // NEW: Create StudentEnrollment if sectionId is provided
        const { sectionId, academicYearId } = req.body;
        if (sectionId) {
            const { StudentEnrollment, AcademicYear } = require('../models/pg');

            // If no academicYearId provided, use the current one
            let finalYearId = academicYearId;
            if (!finalYearId) {
                const currentYear = await AcademicYear.findOne({ where: { isCurrent: true } });
                finalYearId = currentYear ? currentYear.id : null;
            }

            await StudentEnrollment.create({
                studentId: user.id,
                sectionId: sectionId,
                academicYearId: finalYearId
            });
        }


        // Fetch complete student data
        const student = await StudentProfile.findByPk(studentProfile.id, {
            include: [{
                model: User,
                attributes: ['id', 'name', 'email', 'role', 'isActive', 'isApproved']
            }]
        });

        // Log activity (fire and forget)
        const { logStudentRegistration } = require('../middleware/activityLogger');
        logStudentRegistration(user.id, email, name).catch(err => {
            console.error('Failed to log student registration:', err);
        });

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: student
        });
    } catch (error) {
        console.error('Error creating student:', error);
        require('fs').writeFileSync('debug_error.json', JSON.stringify(error, null, 2));
        res.status(500).json({
            success: false,
            error: 'Failed to create student',
            details: error.message,
            validationErrors: error.errors ? error.errors.map(e => e.message) : []
        });
    }



};

/**
 * POST /api/admin/students/bulk-upload
 * Bulk upload students from CSV file
 */
exports.bulkUpload = [
    upload.single('file'),
    async (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        const results = [];
        const errors = [];
        let successCount = 0;
        let failCount = 0;

        try {
            // Read and parse CSV
            const filePath = req.file.path;

            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (row) => {
                        results.push(row);
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });

            // Process each row
            for (let i = 0; i < results.length; i++) {
                const row = results[i];
                const rowNumber = i + 2; // +2 because of header and 0-index

                try {
                    // Validate required fields
                    if (!row.name || !row.email || !row.rollNumber || !row.branch) {
                        errors.push({
                            row: rowNumber,
                            data: row,
                            error: 'Missing required fields (name, email, rollNumber, branch)'
                        });
                        failCount++;
                        continue;
                    }

                    // Check email uniqueness
                    const existingUser = await User.findOne({ where: { email: row.email } });
                    if (existingUser) {
                        errors.push({
                            row: rowNumber,
                            email: row.email,
                            error: 'Email already exists'
                        });
                        failCount++;
                        continue;
                    }

                    // Check roll number uniqueness
                    const existingRollNumber = await StudentProfile.findOne({
                        where: { rollNumber: row.rollNumber }
                    });
                    if (existingRollNumber) {
                        errors.push({
                            row: rowNumber,
                            rollNumber: row.rollNumber,
                            error: 'Roll number already exists'
                        });
                        failCount++;
                        continue;
                    }

                    // Hash password (use provided or default)
                    const password = row.password || 'student123';
                    const hashedPassword = await bcrypt.hash(password, 10);

                    // Create User
                    const user = await User.create({
                        name: row.name,
                        email: row.email,
                        password: hashedPassword,
                        role: 'student',
                        isApproved: true,
                        isActive: true
                    });

                    // Create StudentProfile
                    await StudentProfile.create({
                        userId: user.id,
                        rollNumber: row.rollNumber,
                        branch: row.branch,
                        year: row.year ? parseInt(row.year) : null,
                        section: row.section || null,
                        course: row.course || null,
                        department: row.department || null
                    });

                    successCount++;
                } catch (error) {
                    errors.push({
                        row: rowNumber,
                        data: row,
                        error: error.message
                    });
                    failCount++;
                }
            }

            // Delete temp file
            fs.unlinkSync(filePath);

            res.json({
                success: true,
                data: {
                    total: results.length,
                    inserted: successCount,
                    failed: failCount,
                    errors
                }
            });
        } catch (error) {
            console.error('Error in bulk upload:', error);

            // Clean up file if it exists
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            res.status(500).json({
                success: false,
                error: 'Failed to process CSV file'
            });
        }
    }
];

/**
 * PUT /api/admin/students/:id
 * Update student details
 */
exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            email,
            rollNumber,
            branch,
            year,
            section,
            course,
            department,
            cgpa
        } = req.body;

        // Find student
        const student = await StudentProfile.findByPk(id, {
            include: [User]
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        // Check email uniqueness if changing
        if (email && email !== student.User.email) {
            const existingUser = await User.findOne({
                where: {
                    email,
                    id: { [Op.ne]: student.userId }
                }
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: 'Email already exists'
                });
            }
        }

        // Check roll number uniqueness if changing
        if (rollNumber && rollNumber !== student.rollNumber) {
            const existingRollNumber = await StudentProfile.findOne({
                where: {
                    rollNumber,
                    id: { [Op.ne]: id }
                }
            });
            if (existingRollNumber) {
                return res.status(400).json({
                    success: false,
                    error: 'Roll number already exists'
                });
            }
        }

        // Update User if name or email changed
        if (name || email) {
            await student.User.update({
                ...(name && { name }),
                ...(email && { email })
            });
        }

        // Update StudentProfile
        await student.update({
            ...(rollNumber && { rollNumber }),
            ...(branch && { branch }),
            ...(year !== undefined && { year: parseInt(year) }),
            ...(section !== undefined && { section }),
            ...(course !== undefined && { course }),
            ...(department !== undefined && { department }),
            ...(cgpa !== undefined && { cgpa: parseFloat(cgpa) })
        });

        // Fetch updated student
        const updatedStudent = await StudentProfile.findByPk(id, {
            include: [{
                model: User,
                attributes: ['id', 'name', 'email', 'role', 'isActive', 'isApproved']
            }]
        });

        res.json({
            success: true,
            message: 'Student updated successfully',
            data: updatedStudent
        });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update student'
        });
    }
};

/**
 * DELETE /api/admin/students/:id
 * Delete (deactivate) student
 */
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // Find student
        const student = await StudentProfile.findByPk(id, {
            include: [User]
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        // Soft delete: Deactivate user
        await student.User.update({
            isActive: false
        });

        res.json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete student'
        });
    }
};

/**
 * GET /api/admin/students/:id
 * Get single student details
 */
exports.getStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await StudentProfile.findByPk(id, {
            include: [{
                model: User,
                attributes: ['id', 'name', 'email', 'role', 'isActive', 'isApproved', 'createdAt']
            }]
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch student'
        });
    }
};
