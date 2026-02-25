const { sequelize } = require('../src/config/database');
const { Company, PlacementDrive, JobPosting } = require('../src/models/pg/PlacementModule');

const seedPlacements = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database Connected.");

        // Clear existing (optional, or just add)
        // await Company.destroy({ where: {} });

        // 1. Create Company
        const google = await Company.create({
            name: "Google",
            industry: "Technology",
            website: "https://careers.google.com",
            hrContactName: "Sundar Pichai",
            hrContactEmail: "hr@google.com"
        });
        console.log("Created Company: Google");

        // 2. Create Drive
        const drive = await PlacementDrive.create({
            companyId: google.id,
            driveDate: new Date('2025-10-15'),
            deadline: new Date('2025-10-10'),
            jobDescription: "Software Engineer Role. DSA Required.",
            eligibleBranches: ['CSE', 'IT', 'CCE'], // Array of strings
            minCGPA: 8.0,
            title: "Google Campus Drive 2025"
        });
        console.log("Created Drive: Google Campus Drive 2025");

        // 3. Create Job Posting
        const job = await JobPosting.create({
            driveId: drive.id,
            role: "Software Engineer",
            ctc: "30 LPA",
            ctcValue: 3000000,
            locations: "Bangalore, Hyderabad",
            eligibilityCriteria: { minCGPA: 8.0, branches: ['CSE'] },
            status: 'Open'
        });
        console.log("Created Job: Software Engineer");

        console.log("✅ Placement Seeding Complete.");
    } catch (error) {
        console.error("Seeding Failed:", error);
    } finally {
        await sequelize.close();
    }
};

seedPlacements();
