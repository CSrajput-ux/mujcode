const Company = require('../models/mongo/Company');
const Placement = require('../models/mongo/Placement');
const Faculty = require('../models/mongo/Faculty');
const { StudentProfile } = require('../models/pg');
const { Op } = require('sequelize');

/**
 * Calculate growth percentage between two counts
 */
const calculateGrowth = (currentCount, previousCount) => {
    if (previousCount === 0) return currentCount > 0 ? 100 : 0;
    return Math.round(((currentCount - previousCount) / previousCount) * 100 * 10) / 10;
};

/**
 * Get date range for last month and this month
 */
const getDateRanges = () => {
    const now = new Date();

    // This month
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Last month
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    return { thisMonthStart, lastMonthStart, lastMonthEnd };
};

/**
 * GET /api/admin/dashboard/stats
 * Get dashboard statistics with growth percentages
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const { thisMonthStart, lastMonthStart, lastMonthEnd } = getDateRanges();

        // TOTAL STUDENTS (PostgreSQL)
        const totalStudents = await StudentProfile.count();
        const lastMonthStudents = await StudentProfile.count({
            where: {
                createdAt: {
                    [Op.between]: [lastMonthStart, lastMonthEnd]
                }
            }
        });
        const thisMonthStudents = await StudentProfile.count({
            where: {
                createdAt: {
                    [Op.gte]: thisMonthStart
                }
            }
        });
        const studentGrowthPercent = calculateGrowth(thisMonthStudents, lastMonthStudents);

        // TOTAL FACULTY (MongoDB)
        const totalFaculty = await Faculty.countDocuments();
        const lastMonthFaculty = await Faculty.countDocuments({
            createdAt: {
                $gte: lastMonthStart,
                $lte: lastMonthEnd
            }
        });
        const thisMonthFaculty = await Faculty.countDocuments({
            createdAt: {
                $gte: thisMonthStart
            }
        });
        const facultyGrowthPercent = calculateGrowth(thisMonthFaculty, lastMonthFaculty);

        // TOTAL COMPANIES (MongoDB)
        const totalCompanies = await Company.countDocuments({ isActive: true });
        const lastMonthCompanies = await Company.countDocuments({
            isActive: true,
            createdAt: {
                $gte: lastMonthStart,
                $lte: lastMonthEnd
            }
        });
        const thisMonthCompanies = await Company.countDocuments({
            isActive: true,
            createdAt: {
                $gte: thisMonthStart
            }
        });
        const companyGrowthPercent = calculateGrowth(thisMonthCompanies, lastMonthCompanies);

        // ACTIVE PLACEMENTS (MongoDB)
        // Count placements where status = 'active' AND deadline >= today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activePlacements = await Placement.countDocuments({
            status: 'active',
            deadline: { $gte: today }
        });

        const lastMonthActivePlacements = await Placement.countDocuments({
            status: 'active',
            deadline: { $gte: lastMonthEnd },
            createdAt: {
                $gte: lastMonthStart,
                $lte: lastMonthEnd
            }
        });

        const thisMonthActivePlacements = await Placement.countDocuments({
            status: 'active',
            deadline: { $gte: today },
            createdAt: {
                $gte: thisMonthStart
            }
        });

        const placementGrowthPercent = calculateGrowth(thisMonthActivePlacements, lastMonthActivePlacements);

        res.json({
            success: true,
            data: {
                totalStudents,
                studentGrowthPercent,
                totalFaculty,
                facultyGrowthPercent,
                totalCompanies,
                companyGrowthPercent,
                activePlacements,
                placementGrowthPercent
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard statistics'
        });
    }
};

/**
 * GET /api/admin/students
 * Get paginated list of students
 */
exports.getStudents = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', branch = '', year = '' } = req.query;

        const where = {};
        if (search) {
            where.rollNumber = { [Op.iLike]: `%${search}%` };
        }
        if (branch) {
            where.branch = branch;
        }
        if (year) {
            where.year = parseInt(year);
        }

        const { count, rows } = await StudentProfile.findAndCountAll({
            where,
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
 * GET /api/admin/faculty
 * Get paginated list of faculty
 */
exports.getFaculty = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', department = '' } = req.query;

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (department) {
            query.department = department;
        }

        const total = await Faculty.countDocuments(query);
        const faculty = await Faculty.find(query)
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
 * GET /api/admin/companies
 * Get paginated list of companies
 */
exports.getCompanies = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', industry = '' } = req.query;

        const query = { isActive: true };
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (industry) {
            query.industry = industry;
        }

        const total = await Company.countDocuments(query);
        const companies = await Company.find(query)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                companies,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch companies'
        });
    }
};

/**
 * GET /api/admin/placements
 * Get paginated list of placements with company details
 */
exports.getPlacements = async (req, res) => {
    try {
        const { page = 1, limit = 20, status = '', companyId = '' } = req.query;

        const query = {};
        if (status) {
            query.status = status;
        }
        if (companyId) {
            query.companyId = companyId;
        }

        const total = await Placement.countDocuments(query);
        const placements = await Placement.find(query)
            .populate('companyId', 'name industry location')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                placements,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Error fetching placements:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch placements'
        });
    }
};

/**
 * POST /api/admin/dashboard/companies
 * Create new company
 */
exports.createCompany = async (req, res) => {
    try {
        const {
            name,
            industry,
            website,
            contactPerson,
            contactEmail,
            contactPhone,
            location,
            description
        } = req.body;

        // Validate required fields
        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'Company name is required'
            });
        }

        // Check if company already exists
        const existingCompany = await Company.findOne({ name });
        if (existingCompany) {
            return res.status(400).json({
                success: false,
                error: 'Company already exists'
            });
        }

        // Create company
        const company = await Company.create({
            name,
            industry: industry || '',
            website: website || '',
            contactPerson: contactPerson || '',
            contactEmail: contactEmail || '',
            contactPhone: contactPhone || '',
            location: location || '',
            description: description || '',
            isActive: true
        });

        // Log activity (fire and forget)
        const { logCompanyOnboarded } = require('../middleware/activityLogger');
        logCompanyOnboarded(company._id, name, industry || 'N/A').catch(err => {
            console.error('Failed to log company onboarding:', err);
        });

        res.status(201).json({
            success: true,
            message: 'Company created successfully',
            data: company
        });
    } catch (error) {
        console.error('Error creating company:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create company'
        });
    }
};

/**
 * PUT /api/admin/dashboard/companies/:id
 * Update company details
 */
exports.updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const company = await Company.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!company) {
            return res.status(404).json({
                success: false,
                error: 'Company not found'
            });
        }

        res.json({
            success: true,
            message: 'Company updated successfully',
            data: company
        });
    } catch (error) {
        console.error('Error updating company:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update company'
        });
    }
};

/**
 * POST /api/admin/dashboard/placements
 * Create new placement drive
 */
exports.createPlacement = async (req, res) => {
    try {
        const {
            companyId,
            role,
            description,
            skills,
            eligibilityCriteria,
            salary,
            deadline,
            numberOfPositions
        } = req.body;

        // Validate required fields
        if (!companyId || !role || !deadline) {
            return res.status(400).json({
                success: false,
                error: 'Company ID, role, and deadline are required'
            });
        }

        // Verify company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(400).json({
                success: false,
                error: 'Invalid company ID'
            });
        }

        // Create placement
        const placement = await Placement.create({
            companyId,
            role,
            description: description || '',
            skills: skills || [],
            eligibilityCriteria: eligibilityCriteria || {},
            salary: salary || {},
            status: 'active',
            deadline: new Date(deadline),
            numberOfPositions: numberOfPositions || 1,
            applicants: [],
            createdBy: req.user?.id || 'admin' // Get from auth middleware if available
        });

        // Populate company details
        const populatedPlacement = await Placement.findById(placement._id)
            .populate('companyId', 'name industry location');

        // Log activity (fire and forget)
        const { logPlacementCreated } = require('../middleware/activityLogger');
        logPlacementCreated(placement._id, company.name, role).catch(err => {
            console.error('Failed to log placement creation:', err);
        });

        res.status(201).json({
            success: true,
            message: 'Placement drive created successfully',
            data: populatedPlacement
        });
    } catch (error) {
        console.error('Error creating placement:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create placement'
        });
    }
};

/**
 * PUT /api/admin/dashboard/placements/:id
 * Update placement details
 */
exports.updatePlacement = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const placement = await Placement.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('companyId', 'name industry location');

        if (!placement) {
            return res.status(404).json({
                success: false,
                error: 'Placement not found'
            });
        }

        res.json({
            success: true,
            message: 'Placement updated successfully',
            data: placement
        });
    } catch (error) {
        console.error('Error updating placement:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update placement'
        });
    }
};
