const { PlacementDrive, Company, JobPosting, StudentApplication } = require('../models/pg/PlacementModule');
const { StudentEnrollment } = require('../models/pg/UniversityAssociations');
const User = require('../models/pg/User');
const { Op } = require('sequelize');

// Public/Student: Get Active Placement Drives
exports.getPlacementDrives = async (req, res) => {
    try {
        const drives = await PlacementDrive.findAll({
            include: [
                { model: Company, attributes: ['name', 'logoUrl', 'industry'] },
                { model: JobPosting } // Include jobs
            ],
            order: [['driveDate', 'DESC']]
        });
        res.json(drives);
    } catch (error) {
        console.error("Get Drives Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Student: Apply for a Drive (Job)
exports.applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const studentId = req.user.id; // From Auth Token

        // Validate Job
        const job = await JobPosting.findByPk(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Check if already applied
        const existing = await StudentApplication.findOne({
            where: { jobId, studentId }
        });
        if (existing) return res.status(400).json({ message: "Already applied" });

        // Logic: Check Eligibility?
        // For MVP, just allow apply. 
        // Future: Check CGPA vs job.eligibilityCriteria

        const application = await StudentApplication.create({
            jobId,
            studentId,
            status: 'Applied'
        });

        res.status(201).json({ message: "Applied successfully", application });
    } catch (error) {
        console.error("Apply Job Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Student: Get My Applications
exports.getMyApplications = async (req, res) => {
    try {
        const studentId = req.user.id;
        const applications = await StudentApplication.findAll({
            where: { studentId },
            include: [
                {
                    model: JobPosting,
                    include: [
                        { model: PlacementDrive, include: [Company] }
                    ]
                }
            ]
        });
        res.json(applications);
    } catch (error) {
        console.error("Get Apps Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// TPO/Admin: Create Drive
exports.createDrive = async (req, res) => {
    const { sequelize } = require('../config/database');
    const transaction = await sequelize.transaction();
    try {
        const { companyId, academicYearId, driveDate, title, description, jobs } = req.body;

        const drive = await PlacementDrive.create({
            companyId,
            academicYearId,
            driveDate,
            title,
            description,
            status: 'Scheduled'
        }, { transaction });

        if (jobs && Array.isArray(jobs)) {
            const jobsToCreate = jobs.map(j => ({
                ...j,
                driveId: drive.id
            }));
            await JobPosting.bulkCreate(jobsToCreate, { transaction });
        }

        await transaction.commit();

        // Reload with associations
        const fullDrive = await PlacementDrive.findByPk(drive.id, {
            include: [Company, JobPosting]
        });

        res.status(201).json(fullDrive);
    } catch (error) {
        await transaction.rollback();
        console.error("Create Drive Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// TPO/Admin: Get Companies (PG)
exports.getCompanies = async (req, res) => {
    try {
        const { Company } = require('../models/pg/PlacementModule');
        const companies = await Company.findAll({
            order: [['name', 'ASC']]
        });
        res.json(companies);
    } catch (error) {
        console.error("Get Companies Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
