// File: src/scripts/seedMUJBranches.js
const mongoose = require('mongoose');
const Branch = require('../models/mongo/Branch');
require('dotenv').config();

const mujBranches = [
    // Core Computer Science & IT Branches
    {
        code: 'CSE',
        name: 'Computer Science and Engineering',
        fullName: 'Bachelor of Technology in Computer Science and Engineering',
        department: 'Department of Computer Science and Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['AI & Machine Learning', 'Cyber Security', 'Cloud Computing', 'Data Analytics', 'Computer Vision', 'Web Technologies', 'Full Stack Development', 'IoT'],
        description: 'Comprehensive program covering software development, algorithms, AI/ML, and emerging technologies.',
        admissionCapacity: 120
    },
    {
        code: 'CSE-AIML',
        name: 'Computer Science and Engineering (AI & ML)',
        fullName: 'Bachelor of Technology in Computer Science and Engineering (Artificial Intelligence and Machine Learning)',
        department: 'Department of Computer Science and Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Reinforcement Learning'],
        description: 'Specialized program focused on Artificial Intelligence, Machine Learning, and Deep Learning technologies.',
        admissionCapacity: 60
    },
    {
        code: 'CCE',
        name: 'Computer and Communication Engineering',
        fullName: 'Bachelor of Technology in Computer and Communication Engineering',
        department: 'Department of Computer and Communication Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['Network Security', '5G Technologies', 'IoT Communication'],
        description: 'Integrates computer science with communication technologies for modern network systems.',
        admissionCapacity: 60
    },
    {
        code: 'IT',
        name: 'Information Technology',
        fullName: 'Bachelor of Technology in Information Technology',
        department: 'Department of Information Technology',
        duration: 8,
        totalYears: 4,
        specializations: ['Web Development', 'Mobile App Development', 'Database Management', 'IT Infrastructure'],
        description: 'Focus on software applications, web technologies, and IT infrastructure management.',
        admissionCapacity: 60
    },
    {
        code: 'DSE',
        name: 'Data Science and Engineering',
        fullName: 'Bachelor of Technology in Data Science and Engineering',
        department: 'Department of Computer Science and Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['Big Data Analytics', 'Business Intelligence', 'Data Mining', 'Predictive Analytics'],
        description: 'Specialized program in data analytics, big data, and business intelligence.',
        admissionCapacity: 60
    },
    {
        code: 'CSB',
        name: 'Computer Science and Biosciences',
        fullName: 'Bachelor of Technology in Computer Science and Biosciences',
        department: 'Department of Computer Science and Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['Bioinformatics', 'Computational Biology', 'Healthcare IT'],
        description: 'Interdisciplinary program combining computer science with biological sciences.',
        admissionCapacity: 30
    },
    {
        code: 'CSFT',
        name: 'Computer Science and Financial Technology',
        fullName: 'Bachelor of Technology in Computer Science and Financial Technology',
        department: 'Department of Computer Science and Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['Blockchain', 'FinTech Applications', 'Algorithmic Trading', 'Digital Banking'],
        description: 'Combines computer science with financial technologies and blockchain.',
        admissionCapacity: 30
    },
    {
        code: 'CPS',
        name: 'Cyber Physical Systems',
        fullName: 'Bachelor of Technology in Cyber Physical Systems',
        department: 'Department of Computer Science and Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['Embedded Systems', 'IoT', 'Robotics Control', 'Autonomous Systems'],
        description: 'Integration of physical processes with computational systems.',
        admissionCapacity: 30
    },

    // Electronics & Communication Branches
    {
        code: 'ECE',
        name: 'Electronics and Communication Engineering',
        fullName: 'Bachelor of Technology in Electronics and Communication Engineering',
        department: 'Department of Electronics and Communication Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['VLSI Design', 'Embedded Systems', 'Signal Processing', 'Wireless Communication'],
        description: 'Comprehensive program in electronics, communication systems, and signal processing.',
        admissionCapacity: 90
    },
    {
        code: 'VLSI',
        name: 'Electronics Engineering (VLSI Design and Technology)',
        fullName: 'Bachelor of Technology in Electronics Engineering (VLSI Design and Technology)',
        department: 'Department of Electronics and Communication Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['Chip Design', 'Analog VLSI', 'Digital VLSI', 'FPGA Design'],
        description: 'Specialized program in Very Large Scale Integration design and semiconductor technology.',
        admissionCapacity: 30
    },
    {
        code: 'EIE',
        name: 'Electronics and Instrumentation Engineering',
        fullName: 'Bachelor of Technology in Electronics and Instrumentation Engineering',
        department: 'Department of Electronics and Instrumentation Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['Process Control', 'Industrial Automation', 'Sensors and Transducers'],
        description: 'Focus on measurement systems, control systems, and industrial instrumentation.',
        admissionCapacity: 30
    },
    {
        code: 'EEE',
        name: 'Electrical and Electronics Engineering',
        fullName: 'Bachelor of Technology in Electrical and Electronics Engineering',
        department: 'Department of Electrical and Electronics Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['Power Systems', 'Renewable Energy', 'Electric Vehicles', 'Power Electronics'],
        description: 'Comprehensive program in electrical power systems and electronics.',
        admissionCapacity: 60
    },
    {
        code: 'ECE-EC',
        name: 'Electrical and Computer Engineering',
        fullName: 'Bachelor of Technology in Electrical and Computer Engineering',
        department: 'Department of Electrical Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['Smart Grids', 'Computer Architecture', 'Embedded Systems'],
        description: 'Integration of electrical engineering with computer systems.',
        admissionCapacity: 30
    },

    // Mechanical & Related Branches
    {
        code: 'ME',
        name: 'Mechanical Engineering',
        fullName: 'Bachelor of Technology in Mechanical Engineering',
        department: 'Department of Mechanical Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['Automotive Engineering', 'Advanced Manufacturing', 'Thermal Engineering', 'Design & CAD/CAM'],
        description: 'Core mechanical engineering with focus on design, manufacturing, and thermal systems.',
        admissionCapacity: 90
    },
    {
        code: 'MECH',
        name: 'Mechatronics Engineering',
        fullName: 'Bachelor of Technology in Mechatronics Engineering',
        department: 'Department of Mechatronics Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['Robotics', 'Automation', 'Smart Manufacturing', 'Control Systems'],
        description: 'Interdisciplinary program combining mechanical, electronics, and computer engineering.',
        admissionCapacity: 60
    },
    {
        code: 'AUTO',
        name: 'Automobile Engineering',
        fullName: 'Bachelor of Technology in Automobile Engineering',
        department: 'Department of Automobile Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['Electric Vehicles', 'Automotive Design', 'Hybrid Systems', 'Autonomous Vehicles'],
        description: 'Specialized program in automobile design, manufacturing, and emerging vehicle technologies.',
        admissionCapacity: 30
    },

    // AI & Robotics
    {
        code: 'RAI',
        name: 'Robotics and Artificial Intelligence',
        fullName: 'Bachelor of Technology in Robotics and Artificial Intelligence',
        department: 'Department of Robotics and AI',
        duration: 8,
        totalYears: 4,
        specializations: ['Mobile Robotics', 'Human-Robot Interaction', 'AI Algorithms', 'Computer Vision'],
        description: 'Advanced program combining robotics with artificial intelligence.',
        admissionCapacity: 30
    },

    // Civil Engineering
    {
        code: 'CE',
        name: 'Civil Engineering',
        fullName: 'Bachelor of Technology in Civil Engineering',
        department: 'Department of Civil Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['Structural Engineering', 'Environmental Engineering', 'Transportation Engineering', 'Geotechnical Engineering'],
        description: 'Core civil engineering program covering structures, transportation, and infrastructure.',
        admissionCapacity: 60
    },

    // Chemical & Biotechnology
    {
        code: 'CHE',
        name: 'Chemical Engineering',
        fullName: 'Bachelor of Technology in Chemical Engineering',
        department: 'Department of Chemical Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['Process Engineering', 'Petrochemicals', 'Renewable Energy', 'Polymer Technology'],
        description: 'Program focused on chemical processes, plant design, and industrial chemistry.',
        admissionCapacity: 30
    },
    {
        code: 'BT',
        name: 'Biotechnology',
        fullName: 'Bachelor of Technology in Biotechnology',
        department: 'Department of Biotechnology',
        duration: 8,
        totalYears: 4,
        specializations: ['Genetic Engineering', 'Bioprocess Technology', 'Industrial Biotechnology', 'Pharmaceutical Biotech'],
        description: 'Application of biological systems and processes in engineering and technology.',
        admissionCapacity: 30
    },

    // Other Engineering Branches
    {
        code: 'IE',
        name: 'Industrial Engineering',
        fullName: 'Bachelor of Technology in Industrial Engineering',
        department: 'Department of Industrial Engineering',
        duration: 8,
        totalYears: 4,
        specializations: ['Operations Research', 'Supply Chain Management', 'Quality Management', 'Lean Manufacturing'],
        description: 'Focus on optimization of complex processes and systems.',
        admissionCapacity: 30
    },
    {
        code: 'MNC',
        name: 'Mathematics and Computing',
        fullName: 'Bachelor of Technology in Mathematics and Computing',
        department: 'Department of Mathematics',
        duration: 8,
        totalYears: 4,
        specializations: ['Computational Mathematics', 'Scientific Computing', 'Mathematical Modeling', 'Cryptography'],
        description: 'Integration of advanced mathematics with computer science applications.',
        admissionCapacity: 30
    },
    {
        code: 'FT',
        name: 'Fashion Technology',
        fullName: 'Bachelor of Technology in Fashion Technology',
        department: 'Department of Fashion Technology',
        duration: 8,
        totalYears: 4,
        specializations: ['Textile Design', 'Fashion Design', 'Apparel Manufacturing', 'Fashion Marketing'],
        description: 'Technology-driven approach to fashion design and apparel manufacturing.',
        admissionCapacity: 30
    }
];

async function seedMUJBranches() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Clear existing branches
        const deleteResult = await Branch.deleteMany({});
        console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing branches`);

        // Insert MUJ branches
        const insertedBranches = await Branch.insertMany(mujBranches);
        console.log(`\n✅ Successfully seeded ${insertedBranches.length} MUJ B.Tech branches!`);

        // Print summary
        console.log('\n📚 Branch Categories Summary:');
        console.log('━'.repeat(60));

        const categories = {
            'Computer Science & IT': ['CSE', 'CSE-AIML', 'CCE', 'IT', 'DSE', 'CSB', 'CSFT', 'CPS'],
            'Electronics & Communication': ['ECE', 'VLSI', 'EIE', 'EEE', 'ECE-EC'],
            'Mechanical & Automotive': ['ME', 'MECH', 'AUTO'],
            'AI & Robotics': ['RAI'],
            'Civil Engineering': ['CE'],
            'Chemical & Biotechnology': ['CHE', 'BT'],
            'Others': ['IE', 'MNC', 'FT']
        };

        for (const [category, codes] of Object.entries(categories)) {
            const branchesInCategory = mujBranches.filter(b => codes.includes(b.code));
            const totalCapacity = branchesInCategory.reduce((sum, b) => sum + b.admissionCapacity, 0);
            console.log(`\n${category}:`);
            branchesInCategory.forEach(b => {
                console.log(`  • ${b.code.padEnd(10)} - ${b.name} (Capacity: ${b.admissionCapacity})`);
            });
            console.log(`  Total Capacity: ${totalCapacity} students/year`);
        }

        const totalCapacity = mujBranches.reduce((sum, b) => sum + b.admissionCapacity, 0);
        console.log('\n' + '━'.repeat(60));
        console.log(`🎯 Grand Total: ${mujBranches.length} branches | ${totalCapacity} total admission capacity`);
        console.log('━'.repeat(60));

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding MUJ branches:', error);
        process.exit(1);
    }
}

// Run the seed function
seedMUJBranches();
