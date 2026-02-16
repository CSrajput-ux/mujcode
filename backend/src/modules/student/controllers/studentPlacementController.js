// File: src/modules/student/controllers/studentPlacementController.js
const { PlacementDrive, Company, JobPosting, StudentApplication } = require('../../../models/pg/PlacementModule');
const { Op } = require('sequelize');

// Public/Student: Get Active Placement Drives
exports.getPlacementDrives = async (req, res) => {
    try {
        const drives = await PlacementDrive.findAll({
            include: [
                { model: Company, attributes: ['name', 'logoUrl', 'industry'] },
                { model: JobPosting }
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
        const studentId = req.user.id;

        const job = await JobPosting.findByPk(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        const existing = await StudentApplication.findOne({
            where: { jobId, studentId }
        });
        if (existing) return res.status(400).json({ message: "Already applied" });

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
