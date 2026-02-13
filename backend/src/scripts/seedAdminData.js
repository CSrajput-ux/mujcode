// Script to seed sample companies and placements for Admin Dashboard testing
const mongoose = require('mongoose');
const Company = require('../models/mongo/Company');
const Placement = require('../models/mongo/Placement');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';

const sampleCompanies = [
    {
        name: "Google India",
        industry: "Technology",
        website: "https://google.com",
        contactPerson: "Amit Sharma",
        contactEmail: "amit.sharma@google.com",
        contactPhone: "+91-9876543210",
        location: "Bangalore",
        description: "Global technology leader specializing in search, cloud, and AI",
        isActive: true
    },
    {
        name: "Amazon Development Center",
        industry: "E-commerce & Cloud",
        website: "https://amazon.in",
        contactPerson: "Priya Verma",
        contactEmail: "priya.v@amazon.com",
        contactPhone: "+91-9876543211",
        location: "Hyderabad",
        description: "World's largest online retailer and cloud services provider",
        isActive: true
    },
    {
        name: "Microsoft India",
        industry: "Technology",
        website: "https://microsoft.com",
        contactPerson: "Rajesh Kumar",
        contactEmail: "rajesh.k@microsoft.com",
        contactPhone: "+91-9876543212",
        location: "Pune",
        description: "Leading software and cloud computing company",
        isActive: true
    },
    {
        name: "Infosys",
        industry: "IT Services",
        website: "https://infosys.com",
        contactPerson: "Sunita Reddy",
        contactEmail: "sunita.reddy@infosys.com",
        contactPhone: "+91-9876543213",
        location: "Bangalore",
        description: "Global leader in next-generation digital services and consulting",
        isActive: true
    },
    {
        name: "TCS",
        industry: "IT Services",
        website: "https://tcs.com",
        contactPerson: "Vikram Singh",
        contactEmail: "vikram.singh@tcs.com",
        contactPhone: "+91-9876543214",
        location: "Chennai",
        description: "India's largest IT services company",
        isActive: true
    },
    {
        name: "Flipkart",
        industry: "E-commerce",
        website: "https://flipkart.com",
        contactPerson: "Neha Gupta",
        contactEmail: "neha.g@flipkart.com",
        contactPhone: "+91-9876543215",
        location: "Bangalore",
        description: "Leading Indian e-commerce marketplace",
        isActive: true
    },
    {
        name: "Wipro",
        industry: "IT Services",
        website: "https://wipro.com",
        contactPerson: "Anand Sethi",
        contactEmail: "anand.sethi@wipro.com",
        contactPhone: "+91-9876543216",
        location: "Bangalore",
        description: "Leading global information technology company",
        isActive: true
    },
    {
        name: "Adobe India",
        industry: "Software",
        website: "https://adobe.com",
        contactPerson: "Kavita Jain",
        contactEmail: "kavita.j@adobe.com",
        contactPhone: "+91-9876543217",
        location: "Noida",
        description: "World leader in digital media and marketing solutions",
        isActive: true
    },
    {
        name: "Oracle India",
        industry: "Database & Cloud",
        website: "https://oracle.com",
        contactPerson: "Suresh Patel",
        contactEmail: "suresh.p@oracle.com",
        contactPhone: "+91-9876543218",
        location: "Bangalore",
        description: "Leading provider of database and cloud solutions",
        isActive: true
    },
    {
        name: "Accenture India",
        industry: "Consulting",
        website: "https://accenture.com",
        contactPerson: "Meena Iyer",
        contactEmail: "meena.iyer@accenture.com",
        contactPhone: "+91-9876543219",
        location: "Mumbai",
        description: "Global professional services company",
        isActive: true
    }
];

async function seedAdminData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('\nClearing existing companies and placements...');
        await Company.deleteMany({});
        await Placement.deleteMany({});
        console.log('✅ Cleared existing data');

        // Insert companies
        console.log('\nSeeding companies...');
        const companies = await Company.insertMany(sampleCompanies);
        console.log(`✅ Created ${companies.length} companies`);

        // Create placements for each company
        console.log('\nSeeding placements...');
        const placements = [];

        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);

        const roles = [
            { title: "Software Engineer", cgpa: 7.5, salary: { min: 800000, max: 1200000 } },
            { title: "Full Stack Developer", cgpa: 7.0, salary: { min: 600000, max: 900000 } },
            { title: "Data Scientist", cgpa: 8.0, salary: { min: 1000000, max: 1500000 } },
            { title: "Cloud Engineer", cgpa: 7.5, salary: { min: 900000, max: 1300000 } },
            { title: "DevOps Engineer", cgpa: 7.0, salary: { min: 700000, max: 1000000 } }
        ];

        // Create 45 active placements (mix of companies)
        for (let i = 0; i < 45; i++) {
            const company = companies[i % companies.length];
            const role = roles[i % roles.length];

            placements.push({
                companyId: company._id,
                role: role.title,
                description: `Exciting opportunity for ${role.title} at ${company.name}`,
                skills: ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
                eligibilityCriteria: {
                    minCGPA: role.cgpa,
                    allowedBranches: ["CSE", "IT", "ECE"],
                    allowedYears: [3, 4]
                },
                salary: {
                    min: role.salary.min,
                    max: role.salary.max,
                    currency: "INR"
                },
                status: "active",
                deadline: i < 30 ? nextMonth : nextWeek, // Most have longer deadline
                applicationStartDate: lastMonth,
                numberOfPositions: Math.floor(Math.random() * 10) + 1,
                createdBy: "admin_seed"
            });
        }

        // Create 10 closed placements
        for (let i = 0; i < 10; i++) {
            const company = companies[i % companies.length];
            const role = roles[i % roles.length];

            placements.push({
                companyId: company._id,
                role: role.title,
                description: `Past opportunity for ${role.title}`,
                skills: ["Python", "Java", "SQL"],
                eligibilityCriteria: {
                    minCGPA: 7.0,
                    allowedBranches: ["CSE", "IT"],
                    allowedYears: [4]
                },
                salary: {
                    min: 600000,
                    max: 900000,
                    currency: "INR"
                },
                status: "closed",
                deadline: lastMonth, // Already passed
                applicationStartDate: new Date(lastMonth.getTime() - 30 * 24 * 60 * 60 * 1000),
                numberOfPositions: 5,
                createdBy: "admin_seed"
            });
        }

        await Placement.insertMany(placements);
        console.log(`✅ Created ${placements.length} placements`);
        console.log(`   - ${placements.filter(p => p.status === 'active').length} active placements`);
        console.log(`   - ${placements.filter(p => p.status === 'closed').length} closed placements`);

        console.log('\n🎉 Admin dashboard data seeded successfully!');
        console.log(`\nSummary:`);
        console.log(`  - Companies: ${companies.length}`);
        console.log(`  - Active Placements: ${placements.filter(p => p.status === 'active' && p.deadline >= today).length}`);

        await mongoose.connection.close();
        console.log('\n✅ MongoDB connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin data:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

seedAdminData();
