// MEGA SEED SCRIPT: Complete MUJ Curriculum - All Faculties
// Includes: Engineering, Architecture & Design, Science (B.Sc)
const mongoose = require('mongoose');
const SemesterCourse = require('../models/mongo/SemesterCourse');
require('dotenv').config();

const allMUJCourses = [
    // ... (previous semester 3-6 courses already added earlier)
    // Now adding NEW departments and updating existing ones

    // ==================== CSB (Computer Science & Bioscience) ====================
    // SEMESTER 3
    { courseCode: 'CSB311', courseName: 'Fundamentals of Molecular Biology & Genetics', credits: 4, semester: 3, branches: ['CSB'], courseType: 'Theory' },
    { courseCode: 'CSB312', courseName: 'Principles of Management/Economics', credits: 3, semester: 3, branches: ['CSB'], courseType: 'Theory' },
    { courseCode: 'CSB313', courseName: 'Data Structures & Algorithms', credits: 4, semester: 3, branches: ['CSB'], courseType: 'Theory' },
    { courseCode: 'CSB314', courseName: 'RDBMS', credits: 3, semester: 3, branches: ['CSB'], courseType: 'Theory' },
    { courseCode: 'CSB315', courseName: 'Object Oriented Programming', credits: 3, semester: 3, branches: ['CSB'], courseType: 'Theory' },
    { courseCode: 'CSB316', courseName: 'RDBMS Lab', credits: 1, semester: 3, branches: ['CSB'], courseType: 'Lab' },
    { courseCode: 'CSB317', courseName: 'DSA Lab', credits: 2, semester: 3, branches: ['CSB'], courseType: 'Lab' },
    { courseCode: 'CSB318', courseName: 'Basic Analytical Lab', credits: 1, semester: 3, branches: ['CSB'], courseType: 'Lab' },

    // SEMESTER 4
    { courseCode: 'CSB411', courseName: 'Probability & Statistics', credits: 4, semester: 4, branches: ['CSB'], courseType: 'Theory' },
    { courseCode: 'CSB412', courseName: 'Design & Analysis of Algorithms', credits: 4, semester: 4, branches: ['CSB'], courseType: 'Theory' },
    { courseCode: 'CSB413', courseName: 'Artificial Intelligence', credits: 3, semester: 4, branches: ['CSB'], courseType: 'Theory' },
    { courseCode: 'CSB414', courseName: 'Bioinformatics', credits: 4, semester: 4, branches: ['CSB'], courseType: 'Theory' },
    { courseCode: 'CSB415', courseName: 'Technical Report Writing', credits: 2, semester: 4, branches: ['CSB'], courseType: 'Theory' },
    { courseCode: 'CSB416', courseName: 'DAA Lab', credits: 2, semester: 4, branches: ['CSB'], courseType: 'Lab' },
    { courseCode: 'CSB417', courseName: 'Bioinformatics Lab', credits: 1, semester: 4, branches: ['CSB'], courseType: 'Lab' },
    { courseCode: 'CSB418', courseName: 'Project Based Learning-1', credits: 2, semester: 4, branches: ['CSB'], courseType: 'Project' },

    // SEMESTER 5
    { courseCode: 'CSB511', courseName: 'Computational & Structural Biology', credits: 4, semester: 5, branches: ['CSB'], courseType: 'Theory' },
    { courseCode: 'CSB512', courseName: 'Data Science & Machine Learning', credits: 4, semester: 5, branches: ['CSB'], courseType: 'Theory' },
    { courseCode: 'CSB513', courseName: 'Information System Security', credits: 3, semester: 5, branches: ['CSB'], courseType: 'Theory' },
    { courseCode: 'CSB514', courseName: 'Recombinant DNA Technology', credits: 4, semester: 5, branches: ['CSB'], courseType: 'Theory' },
    { courseCode: 'CSB515', courseName: 'Comp & Structural Biology Lab', credits: 1, semester: 5, branches: ['CSB'], courseType: 'Lab' },
    { courseCode: 'CSB516', courseName: 'Data Science & ML Lab', credits: 2, semester: 5, branches: ['CSB'], courseType: 'Lab' },
    { courseCode: 'CSB517', courseName: 'Project Based Learning-2', credits: 2, semester: 5, branches: ['CSB'], courseType: 'Project' },

    // ==================== CE (Civil Engineering) - NEW ====================
    // SEMESTER 3
    { courseCode: 'MA301-CE', courseName: 'Engineering Mathematics - III', credits: 4, semester: 3, branches: ['CE'], courseType: 'Theory' },
    { courseCode: 'CE311', courseName: 'Fluid Mechanics', credits: 4, semester: 3, branches: ['CE', 'ME', 'CHE'], courseType: 'Theory' },
    { courseCode: 'CE312', courseName: 'Building Materials & Construction', credits: 4, semester: 3, branches: ['CE'], courseType: 'Theory' },
    { courseCode: 'CE313', courseName: 'Surveying', credits: 3, semester: 3, branches: ['CE'], courseType: 'Theory' },
    { courseCode: 'CE314', courseName: 'Structural Analysis', credits: 4, semester: 3, branches: ['CE'], courseType: 'Theory' },
    { courseCode: 'CE315', courseName: 'Material Testing Lab', credits: 1, semester: 3, branches: ['CE'], courseType: 'Lab' },
    { courseCode: 'CE316', courseName: 'Surveying Practice', credits: 2, semester: 3, branches: ['CE'], courseType: 'Lab' },

    // SEMESTER 4
    { courseCode: 'MA401-CE', courseName: 'Engineering Mathematics - IV', credits: 4, semester: 4, branches: ['CE'], courseType: 'Theory' },
    { courseCode: 'CE411', courseName: 'Engineering Geology', credits: 3, semester: 4, branches: ['CE'], courseType: 'Theory' },
    { courseCode: 'CE412', courseName: 'Water Supply Engineering', credits: 4, semester: 4, branches: ['CE'], courseType: 'Theory' },
    { courseCode: 'CE413', courseName: 'Analysis of Indeterminate Structures', credits: 4, semester: 4, branches: ['CE'], courseType: 'Theory' },
    { courseCode: 'CE414', courseName: 'Geology Lab', credits: 1, semester: 4, branches: ['CE'], courseType: 'Lab' },
    { courseCode: 'CE415', courseName: 'Fluid Mechanics Lab', credits: 1, semester: 4, branches: ['CE'], courseType: 'Lab' },
    { courseCode: 'CE416', courseName: 'Building Drawing and Design', credits: 2, semester: 4, branches: ['CE'], courseType: 'Lab' },

    // SEMESTER 5
    { courseCode: 'CE511', courseName: 'Geotechnical Engineering', credits: 4, semester: 5, branches: ['CE'], courseType: 'Theory' },
    { courseCode: 'CE512', courseName: 'Highway Engineering', credits: 4, semester: 5, branches: ['CE'], courseType: 'Theory' },
    { courseCode: 'CE513', courseName: 'Design of Reinforced Concrete Structures', credits: 4, semester: 5, branches: ['CE'], courseType: 'Theory' },
    { courseCode: 'CE514', courseName: 'Waste Water Management', credits: 3, semester: 5, branches: ['CE'], courseType: 'Theory' },
    { courseCode: 'CE515', courseName: 'Geotechnical Engg Lab', credits: 1, semester: 5, branches: ['CE'], courseType: 'Lab' },
    { courseCode: 'CE516', courseName: 'Environmental Engg Lab', credits: 1, semester: 5, branches: ['CE'], courseType: 'Lab' },

    // ==================== CHE (Chemical Engineering) - NEW ====================
    // SEMESTER 3
    { courseCode: 'EC401-CHE', courseName: 'Engineering Economics', credits: 3, semester: 3, branches: ['CHE'], courseType: 'Theory' },
    { courseCode: 'CHE311', courseName: 'Process Calculations', credits: 4, semester: 3, branches: ['CHE'], courseType: 'Theory' },
    { courseCode: 'CHE312', courseName: 'Fluid Mechanics', credits: 4, semester: 3, branches: ['CHE'], courseType: 'Theory' },
    { courseCode: 'CHE313', courseName: 'Chemical Engineering Thermodynamics', credits: 4, semester: 3, branches: ['CHE'], courseType: 'Theory' },
    { courseCode: 'CHE314', courseName: 'Fluid Mechanics Lab', credits: 1, semester: 3, branches: ['CHE'], courseType: 'Lab' },
    { courseCode: 'CHE315', courseName: 'Simulation Lab 1', credits: 1, semester: 3, branches: ['CHE'], courseType: 'Lab' },

    // SEMESTER 4
    { courseCode: 'SP401-CHE', courseName: 'Statistics & Probability', credits: 4, semester: 4, branches: ['CHE'], courseType: 'Theory' },
    { courseCode: 'CHE411', courseName: 'Reaction Engineering', credits: 4, semester: 4, branches: ['CHE'], courseType: 'Theory' },
    { courseCode: 'CHE412', courseName: 'Heat and Mass Transfer', credits: 4, semester: 4, branches: ['CHE'], courseType: 'Theory' },
    { courseCode: 'CHE414', courseName: 'Reaction Engineering Lab', credits: 1, semester: 4, branches: ['CHE'], courseType: 'Lab' },
    { courseCode: 'CHE415', courseName: 'Thermal Processes Lab', credits: 1, semester: 4, branches: ['CHE'], courseType: 'Lab' },

    // SEMESTER 5
    { courseCode: 'CHE511', courseName: 'Process Plant Design', credits: 4, semester: 5, branches: ['CHE'], courseType: 'Theory' },
    { courseCode: 'CHE512', courseName: 'Design of Separation Processes', credits: 4, semester: 5, branches: ['CHE'], courseType: 'Theory' },
    { courseCode: 'CHE514', courseName: 'Separation Processes Lab', credits: 1, semester: 5, branches: ['CHE'], courseType: 'Lab' },
    { courseCode: 'CHE515', courseName: 'Simulation Lab 2', credits: 1, semester: 5, branches: ['CHE'], courseType: 'Lab' },

    // ==================== B.ARCH (Architecture) - NEW ====================
    // SEMESTER 1
    { courseCode: 'ARCH111', courseName: 'Architectural Design I', credits: 6, semester: 1, branches: ['ARCH'], courseType: 'Theory', academicYear: '2024-25' },
    { courseCode: 'ARCH112', courseName: 'Building Construction & Materials I', credits: 4, semester: 1, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH113', courseName: 'Architectural Representation I', credits: 4, semester: 1, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH114', courseName: 'History of Architecture I', credits: 3, semester: 1, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH115', courseName: 'Structures I', credits: 4, semester: 1, branches: ['ARCH'], courseType: 'Theory' },

    // SEMESTER 2
    { courseCode: 'ARCH211', courseName: 'Architectural Design II', credits: 6, semester: 2, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH212', courseName: 'Building Construction & Materials II', credits: 4, semester: 2, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH213', courseName: 'Architectural Representation II', credits: 4, semester: 2, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH214', courseName: 'History of Architecture II', credits: 3, semester: 2, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH215', courseName: 'Structures II', credits: 4, semester: 2, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH216', courseName: 'Climate Responsive Architecture', credits: 3, semester: 2, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH217', courseName: 'Surveying', credits: 2, semester: 2, branches: ['ARCH'], courseType: 'Lab' },

    // SEMESTER 3
    { courseCode: 'ARCH311', courseName: 'Architectural Design III', credits: 6, semester: 3, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH312', courseName: 'Building Construction & Materials III', credits: 4, semester: 3, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH313', courseName: 'Computer Applications I', credits: 3, semester: 3, branches: ['ARCH'], courseType: 'Lab' },
    { courseCode: 'ARCH314', courseName: 'History of Architecture III', credits: 3, semester: 3, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH315', courseName: 'Structures III', credits: 4, semester: 3, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH316', courseName: 'Building Services I', credits: 3, semester: 3, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH317', courseName: 'Landscape Architecture', credits: 3, semester: 3, branches: ['ARCH'], courseType: 'Theory' },

    // SEMESTER 4
    { courseCode: 'ARCH411', courseName: 'Architectural Design IV', credits: 6, semester: 4, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH412', courseName: 'Building Construction & Materials IV', credits: 4, semester: 4, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH413', courseName: 'Computer Applications II', credits: 3, semester: 4, branches: ['ARCH'], courseType: 'Lab' },
    { courseCode: 'ARCH414', courseName: 'History of Architecture IV', credits: 3, semester: 4, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH415', courseName: 'Structures IV', credits: 4, semester: 4, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH416', courseName: 'Building Services II', credits: 3, semester: 4, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH417', courseName: 'Building Codes', credits: 2, semester: 4, branches: ['ARCH'], courseType: 'Theory' },

    // SEMESTER 5
    { courseCode: 'ARCH511', courseName: 'Architectural Design V', credits: 6, semester: 5, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH512', courseName: 'Working Drawing I', credits: 4, semester: 5, branches: ['ARCH'], courseType: 'Lab' },
    { courseCode: 'ARCH513', courseName: 'History of Architecture V', credits: 3, semester: 5, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH514', courseName: 'Structures V', credits: 4, semester: 5, branches: ['ARCH'], courseType: 'Theory' },
    { courseCode: 'ARCH515', courseName: 'Building Services III', credits: 3, semester: 5, branches: ['ARCH'], courseType: 'Theory' },

    // ==================== BFA (Bachelor of Fine Arts) - NEW ====================
    // SEMESTER 1
    { courseCode: 'BFA111', courseName: 'Intro to Graphic Design', credits: 4, semester: 1, branches: ['BFA'], courseType: 'Theory' },
    { courseCode: 'BFA112', courseName: 'Drawing & Representation', credits: 4, semester: 1, branches: ['BFA'], courseType: 'Lab' },
    { courseCode: 'BFA113', courseName: 'Fundamentals of Advertising', credits: 3, semester: 1, branches: ['BFA'], courseType: 'Theory' },
    { courseCode: 'BFA114', courseName: 'Digital Photography', credits: 3, semester: 1, branches: ['BFA'], courseType: 'Lab' },
    { courseCode: 'BFA115', courseName: 'Typography', credits: 4, semester: 1, branches: ['BFA'], courseType: 'Theory' },

    // SEMESTER 2
    { courseCode: 'BFA211', courseName: 'Composition & Color', credits: 4, semester: 2, branches: ['BFA'], courseType: 'Theory' },
    { courseCode: 'BFA212', courseName: 'Analytical Drawing', credits: 4, semester: 2, branches: ['BFA'], courseType: 'Lab' },
    { courseCode: 'BFA213', courseName: 'User Experience Design (UX)', credits: 4, semester: 2, branches: ['BFA'], courseType: 'Theory' },
    { courseCode: 'BFA214', courseName: 'AI for Illustration', credits: 3, semester: 2, branches: ['BFA'], courseType: 'Lab' },
    { courseCode: 'BFA215', courseName: 'Principles of Animation', credits: 4, semester: 2, branches: ['BFA'], courseType: 'Lab' },

    // SEMESTER 3
    { courseCode: 'BFA311', courseName: 'Type Construction', credits: 4, semester: 3, branches: ['BFA'], courseType: 'Lab' },
    { courseCode: 'BFA312', courseName: 'Publication Design', credits: 4, semester: 3, branches: ['BFA'], courseType: 'Theory' },
    { courseCode: 'BFA313', courseName: 'Advanced Graphic Design', credits: 4, semester: 3, branches: ['BFA'], courseType: 'Theory' },
    { courseCode: 'BFA314', courseName: 'Design Research', credits: 3, semester: 3, branches: ['BFA'], courseType: 'Theory' },

    // SEMESTER 4
    { courseCode: 'BFA411', courseName: 'Creative Image Making', credits: 4, semester: 4, branches: ['BFA'], courseType: 'Lab' },
    { courseCode: 'BFA412', courseName: 'Brand Identity Design', credits: 4, semester: 4, branches: ['BFA'], courseType: 'Theory' },
    { courseCode: 'BFA413', courseName: 'Graphic Novel Design', credits: 4, semester: 4, branches: ['BFA'], courseType: 'Theory' },

    // ==================== B.Sc Physics - NEW ====================
    // SEMESTER 1
    { courseCode: 'PHY111', courseName: 'Mechanics', credits: 4, semester: 1, branches: ['BSC-PHY'], courseType: 'Theory' },
    { courseCode: 'PHY112', courseName: 'Waves and Optics', credits: 4, semester: 1, branches: ['BSC-PHY'], courseType: 'Theory' },
    { courseCode: 'PHY113', courseName: 'General Physics Lab', credits: 2, semester: 1, branches: ['BSC-PHY'], courseType: 'Lab' },
    { courseCode: 'PHY114', courseName: 'Waves Lab', credits: 1, semester: 1, branches: ['BSC-PHY'], courseType: 'Lab' },

    // SEMESTER 2
    { courseCode: 'PHY211', courseName: 'Mathematical Physics-I', credits: 4, semester: 2, branches: ['BSC-PHY'], courseType: 'Theory' },
    { courseCode: 'PHY212', courseName: 'Electricity and Magnetism', credits: 4, semester: 2, branches: ['BSC-PHY'], courseType: 'Theory' },
    { courseCode: 'PHY213', courseName: 'Analog Systems Lab', credits: 2, semester: 2, branches: ['BSC-PHY'], courseType: 'Lab' },
    { courseCode: 'PHY214', courseName: 'Electricity Lab', credits: 1, semester: 2, branches: ['BSC-PHY'], courseType: 'Lab' },

    // SEMESTER 3
    { courseCode: 'PHY311', courseName: 'Thermal Physics', credits: 4, semester: 3, branches: ['BSC-PHY'], courseType: 'Theory' },
    { courseCode: 'PHY312', courseName: 'Digital Systems', credits: 4, semester: 3, branches: ['BSC-PHY'], courseType: 'Theory' },
    { courseCode: 'PHY313', courseName: 'Thermal Lab', credits: 2, semester: 3, branches: ['BSC-PHY'], courseType: 'Lab' },
    { courseCode: 'PHY314', courseName: 'Digital Systems Lab', credits: 1, semester: 3, branches: ['BSC-PHY'], courseType: 'Lab' },

    // SEMESTER 4
    { courseCode: 'PHY411', courseName: 'Mathematical Physics II', credits: 4, semester: 4, branches: ['BSC-PHY'], courseType: 'Theory' },
    { courseCode: 'PHY412', courseName: 'Quantum Mechanics', credits: 4, semester: 4, branches: ['BSC-PHY'], courseType: 'Theory' },
    { courseCode: 'PHY413', courseName: 'Electro-Magnetic Theory', credits: 4, semester: 4, branches: ['BSC-PHY'], courseType: 'Theory' },
    { courseCode: 'PHY414', courseName: 'Classical Mechanics', credits: 4, semester: 4, branches: ['BSC-PHY'], courseType: 'Theory' },

    // ==================== B.Sc Biotechnology - NEW ====================
    // SEMESTER 1
    { courseCode: 'BIO111', courseName: 'Diversity of Lower Plants', credits: 4, semester: 1, branches: ['BSC-BT'], courseType: 'Theory' },
    { courseCode: 'BIO112', courseName: 'Fundamentals of Biotechnology', credits: 4, semester: 1, branches: ['BSC-BT'], courseType: 'Theory' },
    { courseCode: 'BIO113', courseName: 'Cell Biology', credits: 4, semester: 1, branches: ['BSC-BT'], courseType: 'Theory' },
    { courseCode: 'BIO114', courseName: 'Botany-I Lab', credits: 2, semester: 1, branches: ['BSC-BT'], courseType: 'Lab' },
    { courseCode: 'BIO115', courseName: 'Biotech-I Lab', credits: 1, semester: 1, branches: ['BSC-BT'], courseType: 'Lab' },

    // SEMESTER 2
    { courseCode: 'BIO211', courseName: 'Mycology & Plant Pathology', credits: 4, semester: 2, branches: ['BSC-BT'], courseType: 'Theory' },
    { courseCode: 'BIO212', courseName: 'Elements of Biochemistry', credits: 4, semester: 2, branches: ['BSC-BT'], courseType: 'Theory' },
    { courseCode: 'BIO213', courseName: 'Gymnosperms', credits: 3, semester: 2, branches: ['BSC-BT'], courseType: 'Theory' },
    { courseCode: 'BIO214', courseName: 'Essentials of Microbiology', credits: 4, semester: 2, branches: ['BSC-BT'], courseType: 'Theory' },

    // SEMESTER 3
    { courseCode: 'BIO311', courseName: 'Fundamentals of Bioinformatics', credits: 4, semester: 3, branches: ['BSC-BT'], courseType: 'Theory' },
    { courseCode: 'BIO312', courseName: 'Molecular Biology', credits: 4, semester: 3, branches: ['BSC-BT'], courseType: 'Theory' },
    { courseCode: 'BIO313', courseName: 'Genetics', credits: 4, semester: 3, branches: ['BSC-BT'], courseType: 'Theory' },
    { courseCode: 'BIO314', courseName: 'Plant Tissue Culture', credits: 3, semester: 3, branches: ['BSC-BT'], courseType: 'Theory' },
    { courseCode: 'BIO315', courseName: 'Botany-III Lab', credits: 1, semester: 3, branches: ['BSC-BT'], courseType: 'Lab' },
    { courseCode: 'BIO316', courseName: 'Biotech-III Lab', credits: 1, semester: 3, branches: ['BSC-BT'], courseType: 'Lab' },
    { courseCode: 'BIO317', courseName: 'PTC Lab', credits: 1, semester: 3, branches: ['BSC-BT'], courseType: 'Lab' },

    // SEMESTER 4
    { courseCode: 'BIO411', courseName: 'Introduction to Biotechniques', credits: 4, semester: 4, branches: ['BSC-BT'], courseType: 'Theory' },
    { courseCode: 'BIO412', courseName: 'Immunology', credits: 4, semester: 4, branches: ['BSC-BT'], courseType: 'Theory' },
    { courseCode: 'BIO413', courseName: 'Recombinant DNA Technology', credits: 4, semester: 4, branches: ['BSC-BT'], courseType: 'Theory' },
    { courseCode: 'BIO414', courseName: 'Agricultural Biotechnology', credits: 3, semester: 4, branches: ['BSC-BT'], courseType: 'Theory' },

    // ==================== B.Sc Micro biology - NEW ====================
    // SEMESTER 1
    { courseCode: 'MIC111', courseName: 'Diversity of Lower Plants', credits: 4, semester: 1, branches: ['BSC-MIC'], courseType: 'Theory' },
    { courseCode: 'MIC112', courseName: 'Fundamentals of Biotechnology', credits: 4, semester: 1, branches: ['BSC-MIC'], courseType: 'Theory' },
    { courseCode: 'MIC113', courseName: 'Cell Biology', credits: 4, semester: 1, branches: ['BSC-MIC'], courseType: 'Theory' },

    // SEMESTER 2
    { courseCode: 'MIC211', courseName: 'Mycology', credits: 4, semester: 2, branches: ['BSC-MIC'], courseType: 'Theory' },
    { courseCode: 'MIC212', courseName: 'Biochemistry', credits: 4, semester: 2, branches: ['BSC-MIC'], courseType: 'Theory' },
    { courseCode: 'MIC213', courseName: 'Cell Biology of Microorganisms', credits: 4, semester: 2, branches: ['BSC-MIC'], courseType: 'Theory' },
    { courseCode: 'MIC214', courseName: 'Microbial Nutrition', credits: 3, semester: 2, branches: ['BSC-MIC'], courseType: 'Theory' },
    { courseCode: 'MIC215', courseName: 'Cell Bio & Biochem Lab', credits: 2, semester: 2, branches: ['BSC-MIC'], courseType: 'Lab' },
    { courseCode: 'MIC216', courseName: 'Microbiology-II Lab', credits: 1, semester: 2, branches: ['BSC-MIC'], courseType: 'Lab' },

    // SEMESTER 3
    { courseCode: 'MIC311', courseName: 'Bioinformatics', credits: 4, semester: 3, branches: ['BSC-MIC'], courseType: 'Theory' },
    { courseCode: 'MIC312', courseName: 'Microbial Genetics', credits: 4, semester: 3, branches: ['BSC-MIC'], courseType: 'Theory' },
    { courseCode: 'MIC313', courseName: 'Virology', credits: 4, semester: 3, branches: ['BSC-MIC'], courseType: 'Theory' },
    { courseCode: 'MIC314', courseName: 'Biology-III Lab', credits: 2, semester: 3, branches: ['BSC-MIC'], courseType: 'Lab' },
    { courseCode: 'MIC315', courseName: 'Microbiology-III Lab', credits: 1, semester: 3, branches: ['BSC-MIC'], courseType: 'Lab' },

    // SEMESTER 4
    { courseCode: 'MIC411', courseName: 'Biotechniques', credits: 4, semester: 4, branches: ['BSC-MIC'], courseType: 'Theory' },
    { courseCode: 'MIC412', courseName: 'Immunology', credits: 4, semester: 4, branches: ['BSC-MIC'], courseType: 'Theory' },
    { courseCode: 'MIC413', courseName: 'Recombinant DNA Tech', credits: 4, semester: 4, branches: ['BSC-MIC'], courseType: 'Theory' },
    { courseCode: 'MIC414', courseName: 'Food & Dairy Microbiology', credits: 4, semester: 4, branches: ['BSC-MIC'], courseType: 'Theory' }
];

async function seedCompleteMUJCurriculum() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode');
        console.log('✅ Connected to MongoDB');

        // Clear ALL existing semester courses
        const deleteResult = await SemesterCourse.deleteMany({});
        console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing courses`);

        // Insert ALL courses (this includes the previous ones + new ones)
        const insertedCourses = await SemesterCourse.insertMany(allMUJCourses);
        console.log(`\n✅ Successfully seeded ${insertedCourses.length} total courses!`);

        console.log('\n📚 Complete MUJ Curriculum Summary:');
        console.log('━'.repeat(80));

        const facultyGroups = {
            'Engineering - CS/IT': ['CSE', 'CSB', 'IT', 'DSE', 'CSFT', 'CPS', 'MNC'],
            'Engineering - EC/EE': ['ECE', 'VLSI', 'EIE', 'EEE', 'ECE-EC'],
            'Engineering - Mechanical': ['ME', 'MECH', 'AUTO', 'RAI'],
            'Engineering - Civil & Chemical': ['CE', 'CHE'],
            'Architecture & Design': ['ARCH', 'BFA'],
            'Science (B.Sc)': ['BSC-PHY', 'BSC-BT', 'BSC-MIC']
        };

        let grandTotal = 0;
        for (const [faculty, branches] of Object.entries(facultyGroups)) {
            const facultyCourses = allMUJCourses.filter(c => branches.some(b => c.branches.includes(b)));
            console.log(`\n**${faculty}** (${facultyCourses.length} courses)`);

            branches.forEach(branch => {
                const branchCourses = allMUJCourses.filter(c => c.branches.includes(branch));
                if (branchCourses.length > 0) {
                    const totalCredits = branchCourses.reduce((sum, c) => sum + c.credits, 0);
                    console.log(`  ${branch}: ${branchCourses.length} courses (${totalCredits} credits)`);
                    grandTotal += branchCourses.length;
                }
            });
        }

        console.log('\n' + '━'.repeat(80));
        console.log(`🎯 **COMPLETE MUJ CURRICULUM LOADED**: ${allMUJCourses.length} courses`);
        console.log('   - Engineering: Multiple branches');
        console.log('   - Architecture & Design: B.Arch, B.F.A');
        console.log('   - Science: B.Sc Physics, Biotechnology, Microbiology');
        console.log('━'.repeat(80));

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding complete curriculum:', error);
        process.exit(1);
    }
}

seedCompleteMUJCurriculum();
