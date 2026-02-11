// File: src/scripts/seedMUJSemesterCourses.js
const mongoose = require('mongoose');
const SemesterCourse = require('../models/mongo/SemesterCourse');
require('dotenv').config();

const semesterCourses = [
    // ==================== SEMESTER 1 (Common for All Branches) ====================
    {
        courseCode: 'MA101',
        courseName: 'Calculus and Linear Algebra',
        credits: 4,
        semester: 1,
        branches: ['ALL'],
        courseType: 'Theory',
        syllabusOverview: 'Differential calculus, integral calculus, matrices, determinants, vector spaces, and linear transformations.',
        contactHours: { lecture: 3, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'PH101',
        courseName: 'Physics for Engineers',
        credits: 4,
        semester: 1,
        branches: ['ALL'],
        courseType: 'Theory',
        syllabusOverview: 'Mechanics, properties of matter, thermodynamics, oscillations, waves, and optics.',
        contactHours: { lecture: 3, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'PH102',
        courseName: 'Physics Laboratory',
        credits: 1,
        semester: 1,
        branches: ['ALL'],
        courseType: 'Lab',
        syllabusOverview: 'Experimental verification of physics concepts and measurement techniques.',
        contactHours: { lecture: 0, tutorial: 0, practical: 2 },
        evaluationScheme: { midTerm: 0, endTerm: 30, continuous: 40, practical: 30 }
    },
    {
        courseCode: 'CS101',
        courseName: 'Programming for Problem Solving',
        credits: 3,
        semester: 1,
        branches: ['ALL'],
        courseType: 'Theory',
        syllabusOverview: 'Introduction to C programming, problem-solving techniques, algorithms, functions, arrays, pointers, and file handling.',
        contactHours: { lecture: 3, tutorial: 0, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'CS102',
        courseName: 'Programming Lab',
        credits: 2,
        semester: 1,
        branches: ['ALL'],
        courseType: 'Lab',
        syllabusOverview: 'Hands-on programming practice in C language.',
        contactHours: { lecture: 0, tutorial: 0, practical: 4 },
        evaluationScheme: { midTerm: 0, endTerm: 30, continuous: 40, practical: 30 }
    },
    {
        courseCode: 'EG101',
        courseName: 'Engineering Graphics and Design',
        credits: 4,
        semester: 1,
        branches: ['ALL'],
        courseType: 'Theory',
        syllabusOverview: 'Orthographic projections, isometric views, sectional views, and CAD fundamentals.',
        contactHours: { lecture: 2, tutorial: 0, practical: 2 },
        evaluationScheme: { midTerm: 30, endTerm: 40, continuous: 30, practical: 0 }
    },
    {
        courseCode: 'EN101',
        courseName: 'English Communication',
        credits: 3,
        semester: 1,
        branches: ['ALL'],
        courseType: 'Theory',
        syllabusOverview: 'Communication skills, technical writing, presentation skills, and professional communication.',
        contactHours: { lecture: 2, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },

    // ==================== SEMESTER 2 (Common for All Branches) ====================
    {
        courseCode: 'MA201',
        courseName: 'Differential Equations and Vector Calculus',
        credits: 4,
        semester: 2,
        branches: ['ALL'],
        courseType: 'Theory',
        syllabusOverview: 'Ordinary differential equations, partial differential equations, vector calculus, and applications.',
        contactHours: { lecture: 3, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'CH201',
        courseName: 'Chemistry for Engineers',
        credits: 4,
        semester: 2,
        branches: ['ALL'],
        courseType: 'Theory',
        syllabusOverview: 'Atomic structure, chemical bonding, thermodynamics, electrochemistry, and materials chemistry.',
        contactHours: { lecture: 3, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'CH202',
        courseName: 'Chemistry Laboratory',
        credits: 1,
        semester: 2,
        branches: ['ALL'],
        courseType: 'Lab',
        syllabusOverview: 'Experiments in physical and analytical chemistry.',
        contactHours: { lecture: 0, tutorial: 0, practical: 2 },
        evaluationScheme: { midTerm: 0, endTerm: 30, continuous: 40, practical: 30 }
    },
    {
        courseCode: 'EE201',
        courseName: 'Basic Electrical Engineering',
        credits: 3,
        semester: 2,
        branches: ['CSE', 'CSE-AIML', 'CCE', 'IT', 'DSE', 'CSB', 'CSFT', 'CPS', 'ME', 'MECH', 'AUTO', 'CE', 'CHE', 'BT', 'IE'],
        courseType: 'Theory',
        syllabusOverview: 'DC circuits, AC circuits, transformers, electrical machines, and power systems basics.',
        contactHours: { lecture: 3, tutorial: 0, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'EC201',
        courseName: 'Basic Electronics Engineering',
        credits: 3,
        semester: 2,
        branches: ['CSE', 'CSE-AIML', 'CCE', 'IT', 'DSE', 'CSB', 'CSFT', 'CPS', 'ME', 'MECH', 'AUTO', 'CE', 'CHE', 'BT'],
        courseType: 'Theory',
        syllabusOverview: 'Semiconductor devices, diodes, transistors, amplifiers, oscillators, and digital electronics basics.',
        contactHours: { lecture: 3, tutorial: 0, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'EE202',
        courseName: 'Electrical and Electronics Lab',
        credits: 1,
        semester: 2,
        branches: ['ALL'],
        courseType: 'Lab',
        syllabusOverview: 'Experiments on electrical circuits and electronic devices.',
        contactHours: { lecture: 0, tutorial: 0, practical: 2 },
        evaluationScheme: { midTerm: 0, endTerm: 30, continuous: 40, practical: 30 }
    },
    {
        courseCode: 'ES201',
        courseName: 'Environmental Science',
        credits: 3,
        semester: 2,
        branches: ['ALL'],
        courseType: 'Theory',
        syllabusOverview: 'Ecosystems, biodiversity, environmental pollution, natural resources, and sustainable development.',
        contactHours: { lecture: 3, tutorial: 0, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'HS201',
        courseName: 'Indian Constitution and Traditional Knowledge',
        credits: 2,
        semester: 2,
        branches: ['ALL'],
        courseType: 'Theory',
        syllabusOverview: 'Indian constitutional framework, fundamental rights, duties, and traditional Indian knowledge systems.',
        contactHours: { lecture: 2, tutorial: 0, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },

    // ==================== SEMESTER 3 - CSE/IT/CS Branches ====================
    {
        courseCode: 'CS301',
        courseName: 'Data Structures',
        credits: 4,
        semester: 3,
        branches: ['CSE', 'CSE-AIML', 'CCE', 'IT', 'DSE', 'CSB', 'CSFT', 'CPS', 'MNC'],
        courseType: 'Theory',
        syllabusOverview: 'Arrays, linked lists, stacks, queues, trees, graphs, sorting, searching, and algorithm analysis.',
        contactHours: { lecture: 3, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 },
        prerequisites: ['CS101']
    },
    {
        courseCode: 'CS302',
        courseName: 'Data Structures Lab',
        credits: 2,
        semester: 3,
        branches: ['CSE', 'CSE-AIML', 'CCE', 'IT', 'DSE', 'CSB', 'CSFT', 'CPS', 'MNC'],
        courseType: 'Lab',
        syllabusOverview: 'Implementation of data structures and algorithms.',
        contactHours: { lecture: 0, tutorial: 0, practical: 4 },
        evaluationScheme: { midTerm: 0, endTerm: 30, continuous: 40, practical: 30 }
    },
    {
        courseCode: 'CS303',
        courseName: 'Object-Oriented Programming',
        credits: 3,
        semester: 3,
        branches: ['CSE', 'CSE-AIML', 'CCE', 'IT', 'DSE', 'CSB', 'CSFT', 'CPS'],
        courseType: 'Theory',
        syllabusOverview: 'OOP concepts, C++/Java programming, inheritance, polymorphism, encapsulation, and design patterns.',
        contactHours: { lecture: 3, tutorial: 0, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 },
        prerequisites: ['CS101']
    },
    {
        courseCode: 'CS304',
        courseName: 'OOP Lab',
        credits: 1,
        semester: 3,
        branches: ['CSE', 'CSE-AIML', 'CCE', 'IT', 'DSE', 'CSB', 'CSFT', 'CPS'],
        courseType: 'Lab',
        syllabusOverview: 'Programming practice in C++ or Java.',
        contactHours: { lecture: 0, tutorial: 0, practical: 2 },
        evaluationScheme: { midTerm: 0, endTerm: 30, continuous: 40, practical: 30 }
    },
    {
        courseCode: 'CS305',
        courseName: 'Digital Logic and Computer Organization',
        credits: 4,
        semester: 3,
        branches: ['CSE', 'CSE-AIML', 'CCE', 'IT', 'CPS'],
        courseType: 'Theory',
        syllabusOverview: 'Boolean algebra, combinational and sequential circuits, computer architecture, CPU organization, memory hierarchy.',
        contactHours: { lecture: 3, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'MA301',
        courseName: 'Discrete Mathematics',
        credits: 4,
        semester: 3,
        branches: ['CSE', 'CSE-AIML', 'CCE', 'IT', 'DSE', 'CSB', 'CSFT', 'MNC'],
        courseType: 'Theory',
        syllabusOverview: 'Sets, relations, functions, graph theory, combinatorics, and mathematical logic.',
        contactHours: { lecture: 3, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },

    // ==================== SEMESTER 4 - CSE/IT/CS Branches ====================
    {
        courseCode: 'CS401',
        courseName: 'Database Management Systems',
        credits: 3,
        semester: 4,
        branches: ['CSE', 'CSE-AIML', 'CCE', 'IT', 'DSE', 'CSB', 'CSFT'],
        courseType: 'Theory',
        syllabusOverview: 'Database concepts, ER model, relational model, SQL, normalization, transactions, and indexing.',
        contactHours: { lecture: 3, tutorial: 0, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'CS402',
        courseName: 'DBMS Lab',
        credits: 1,
        semester: 4,
        branches: ['CSE', 'CSE-AIML', 'CCE', 'IT', 'DSE', 'CSB', 'CSFT'],
        courseType: 'Lab',
        syllabusOverview: 'SQL queries, PL/SQL programming, and database design.',
        contactHours: { lecture: 0, tutorial: 0, practical: 2 },
        evaluationScheme: { midTerm: 0, endTerm: 30, continuous: 40, practical: 30 }
    },
    {
        courseCode: 'CS403',
        courseName: 'Operating Systems',
        credits: 4,
        semester: 4,
        branches: ['CSE', 'CSE-AIML', 'CCE', 'IT', 'CSB', 'CSFT', 'CPS'],
        courseType: 'Theory',
        syllabusOverview: 'Process management, threads, CPU scheduling, memory management, file systems, and deadlocks.',
        contactHours: { lecture: 3, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'CS404',
        courseName: 'Design and Analysis of Algorithms',
        credits: 4,
        semester: 4,
        branches: ['CSE', 'CSE-AIML', 'CCE', 'IT', 'DSE', 'MNC'],
        courseType: 'Theory',
        syllabusOverview: 'Algorithm design techniques, divide and conquer, greedy, dynamic programming, backtracking, complexity analysis.',
        contactHours: { lecture: 3, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 },
        prerequisites: ['CS301']
    },
    {
        courseCode: 'CS405',
        courseName: 'Computer Networks',
        credits: 3,
        semester: 4,
        branches: ['CSE', 'CSE-AIML', 'CCE', 'IT', 'CPS'],
        courseType: 'Theory',
        syllabusOverview: 'OSI model, TCP/IP, network protocols, routing, switching, and network security basics.',
        contactHours: { lecture: 3, tutorial: 0, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'MA401',
        courseName: 'Probability and Statistics',
        credits: 4,
        semester: 4,
        branches: ['CSE', 'CSE-AIML', 'IT', 'DSE', 'ECE', 'EEE', 'MNC'],
        courseType: 'Theory',
        syllabusOverview: 'Probability theory, random variables, distributions, hypothesis testing, regression analysis.',
        contactHours: { lecture: 3, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },

    // ==================== SEMESTER 3 - ECE/Electronics Branches ====================
    {
        courseCode: 'EC301',
        courseName: 'Signals and Systems',
        credits: 4,
        semester: 3,
        branches: ['ECE', 'VLSI', 'EIE', 'CCE'],
        courseType: 'Theory',
        syllabusOverview: 'Continuous and discrete signals, Fourier series, Fourier transform, Laplace transform, Z-transform.',
        contactHours: { lecture: 3, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'EC302',
        courseName: 'Network Theory',
        credits: 4,
        semester: 3,
        branches: ['ECE', 'VLSI', 'EIE', 'EEE'],
        courseType: 'Theory',
        syllabusOverview: 'Circuit analysis, network theorems, two-port networks, filters, and network synthesis.',
        contactHours: { lecture: 3, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'EC303',
        courseName: 'Analog Electronics',
        credits: 4,
        semester: 3,
        branches: ['ECE', 'VLSI', 'EIE', 'EEE'],
        courseType: 'Theory',
        syllabusOverview: 'BJT, FET, amplifiers, oscillators, multivibrators, and power amplifiers.',
        contactHours: { lecture: 3, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'EC304',
        courseName: 'Electronics Lab',
        credits: 2,
        semester: 3,
        branches: ['ECE', 'VLSI', 'EIE', 'EEE'],
        courseType: 'Lab',
        syllabusOverview: 'Experiments on analog circuits and devices.',
        contactHours: { lecture: 0, tutorial: 0, practical: 4 },
        evaluationScheme: { midTerm: 0, endTerm: 30, continuous: 40, practical: 30 }
    },

    // ==================== SEMESTER 3 - Mechanical Branches ====================
    {
        courseCode: 'ME301',
        courseName: 'Engineering Mechanics',
        credits: 4,
        semester: 3,
        branches: ['ME', 'MECH', 'AUTO', 'CE', 'RAI'],
        courseType: 'Theory',
        syllabusOverview: 'Statics, dynamics, force systems, friction, kinematics, and kinetics of particles and rigid bodies.',
        contactHours: { lecture: 3, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'ME302',
        courseName: 'Thermodynamics',
        credits: 4,
        semester: 3,
        branches: ['ME', 'MECH', 'AUTO', 'CHE'],
        courseType: 'Theory',
        syllabusOverview: 'Laws of thermodynamics, thermodynamic cycles, entropy, gas power cycles, and refrigeration.',
        contactHours: { lecture: 3, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'ME303',
        courseName: 'Mechanics of Materials',
        credits: 4,
        semester: 3,
        branches: ['ME', 'MECH', 'AUTO', 'CE'],
        courseType: 'Theory',
        syllabusOverview: 'Stress, strain, bending, shear, torsion, deflection of beams, and column theory.',
        contactHours: { lecture: 3, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'ME304',
        courseName: 'Manufacturing Processes',
        credits: 3,
        semester: 3,
        branches: ['ME', 'MECH', 'AUTO', 'IE'],
        courseType: 'Theory',
        syllabusOverview: 'Casting, welding, machining, forming processes, and modern manufacturing techniques.',
        contactHours: { lecture: 3, tutorial: 0, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },

    // ==================== SEMESTER 3 - Civil Engineering ====================
    {
        courseCode: 'CE301',
        courseName: 'Surveying',
        credits: 4,
        semester: 3,
        branches: ['CE'],
        courseType: 'Theory',
        syllabusOverview: 'Leveling, theodolite surveying, traversing, triangulation, and total station.',
        contactHours: { lecture: 3, tutorial: 0, practical: 1 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'CE302',
        courseName: 'Fluid Mechanics',
        credits: 4,
        semester: 3,
        branches: ['CE', 'ME', 'CHE'],
        courseType: 'Theory',
        syllabusOverview: 'Fluid properties, hydrostatics, fluid dynamics, Bernoulli equation, and flow measurements.',
        contactHours: { lecture: 3, tutorial: 1, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    },
    {
        courseCode: 'CE303',
        courseName: 'Building Materials and Construction',
        credits: 3,
        semester: 3,
        branches: ['CE'],
        courseType: 'Theory',
        syllabusOverview: 'Cement, aggregates, concrete, steel, timber, and construction techniques.',
        contactHours: { lecture: 3, tutorial: 0, practical: 0 },
        evaluationScheme: { midTerm: 30, endTerm: 50, continuous: 20, practical: 0 }
    }
];

async function seedMUJSemesterCourses() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Clear existing semester courses
        const deleteResult = await SemesterCourse.deleteMany({});
        console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing semester courses`);

        // Insert semester courses
        const insertedCourses = await SemesterCourse.insertMany(semesterCourses);
        console.log(`\n✅ Successfully seeded ${insertedCourses.length} semester courses!`);

        // Print summary by semester
        console.log('\n📚 Semester-wise Course Summary:');
        console.log('━'.repeat(80));

        for (let sem = 1; sem <= 4; sem++) {
            const coursesInSem = semesterCourses.filter(c => c.semester === sem);
            const totalCredits = coursesInSem.reduce((sum, c) => sum + c.credits, 0);

            console.log(`\n📖 SEMESTER ${sem} (${coursesInSem.length} courses, ${totalCredits} total credits)`);
            console.log('─'.repeat(80));

            coursesInSem.forEach(course => {
                const branchInfo = course.branches.includes('ALL') ? 'All Branches' :
                    course.branches.length > 5 ? `${course.branches.length} branches` :
                        course.branches.join(', ');
                console.log(`  ${course.courseCode.padEnd(8)} | ${course.courseName.padEnd(45)} | ${course.credits}cr | ${course.courseType.padEnd(7)} | ${branchInfo}`);
            });
        }

        // Summary by branch coverage
        console.log('\n' + '━'.repeat(80));
        console.log('📊 Coverage Statistics:');
        const commonCourses = semesterCourses.filter(c => c.branches.includes('ALL')).length;
        const branchSpecific = semesterCourses.length - commonCourses;
        console.log(`  • Common courses (All branches): ${commonCourses}`);
        console.log(`  • Branch-specific courses: ${branchSpecific}`);
        console.log(`  • Total courses seeded: ${semesterCourses.length}`);

        const totalCredits = semesterCourses.reduce((sum, c) => sum + c.credits, 0);
        console.log(`  • Total credits across all courses: ${totalCredits}`);
        console.log('━'.repeat(80));

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding semester courses:', error);
        process.exit(1);
    }
}

// Run the seed function
seedMUJSemesterCourses();
