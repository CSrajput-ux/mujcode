// File: src/modules/admin/controllers/adminPlacementController.js
const { PlacementDrive, Company, JobPosting } = require('../../../models/pg/PlacementModule');
const { sequelize } = require('../../../config/database');

// TPO/Admin: Create Drive
exports.createDrive = async (req, res) => {
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
        const companies = await Company.findAll({
            order: [['name', 'ASC']]
        });
        res.json(companies);
    } catch (error) {
        console.error("Get Companies Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
