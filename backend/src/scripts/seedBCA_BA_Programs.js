// FINAL MEGA SEED: Complete MUJ - All Faculties
// BCA, B.Sc (Chemistry, Maths), B.A. (BAJMC, Psychology, Economics, English)
const mongoose = require('mongoose');
const SemesterCourse = require('../models/mongo/SemesterCourse');
require('dotenv').config();

const newFacultyPrograms = [
    // ==================== BCA (Bachelor of Computer Applications) ====================
    // SEMESTER 1
    { courseCode: 'BCA111', courseName: 'Fundamentals of Computer & IT', credits: 4, semester: 1, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA112', courseName: 'Problem Solving using C', credits: 4, semester: 1, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA113', courseName: 'Basic Mathematics', credits: 4, semester: 1, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA114', courseName: 'Communication Skills', credits: 3, semester: 1, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA115', courseName: 'Environmental Science', credits: 2, semester: 1, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA116', courseName: 'Office Automation Lab', credits: 2, semester: 1, branches: ['BCA'], courseType: 'Lab' },
    { courseCode: 'BCA117', courseName: 'C Programming Lab', credits: 2, semester: 1, branches: ['BCA'], courseType: 'Lab' },
    { courseCode: 'BCA118', courseName: 'Communication Skills Lab', credits: 1, semester: 1, branches: ['BCA'], courseType: 'Lab' },

    // SEMESTER 2
    { courseCode: 'BCA211', courseName: 'Data Structures using C', credits: 4, semester: 2, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA212', courseName: 'Web Technology-I (HTML/CSS)', credits: 4, semester: 2, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA213', courseName: 'Digital Logic', credits: 3, semester: 2, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA214', courseName: 'Discrete Mathematics', credits: 4, semester: 2, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA215', courseName: 'Data Structure Lab', credits: 2, semester: 2, branches: ['BCA'], courseType: 'Lab' },
    { courseCode: 'BCA216', courseName: 'Web Tech Lab-I', credits: 2, semester: 2, branches: ['BCA'], courseType: 'Lab' },

    // SEMESTER 3
    { courseCode: 'BCA311', courseName: 'Object Oriented Programming using C++', credits: 4, semester: 3, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA312', courseName: 'Database Management Systems (DBMS)', credits: 4, semester: 3, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA313', courseName: 'Operating Systems', credits: 4, semester: 3, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA314', courseName: 'Computer Architecture', credits: 3, semester: 3, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA315', courseName: 'C++ Lab', credits: 2, semester: 3, branches: ['BCA'], courseType: 'Lab' },
    { courseCode: 'BCA316', courseName: 'DBMS Lab', credits: 2, semester: 3, branches: ['BCA'], courseType: 'Lab' },

    // SEMESTER 4
    { courseCode: 'BCA411', courseName: 'Java Programming', credits: 4, semester: 4, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA412', courseName: 'Software Engineering', credits: 4, semester: 4, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA413', courseName: 'Computer Networks', credits: 4, semester: 4, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA414', courseName: 'Python Programming', credits: 4, semester: 4, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA415', courseName: 'Java Lab', credits: 2, semester: 4, branches: ['BCA'], courseType: 'Lab' },
    { courseCode: 'BCA416', courseName: 'Python Lab', credits: 2, semester: 4, branches: ['BCA'], courseType: 'Lab' },

    // SEMESTER 5
    { courseCode: 'BCA511', courseName: 'Web Technology-II (PHP/MySQL)', credits: 4, semester: 5, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA512', courseName: 'Cloud Computing', credits: 4, semester: 5, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA513', courseName: 'Mobile Application Development (Android)', credits: 4, semester: 5, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA514', courseName: 'Web Tech II Lab', credits: 2, semester: 5, branches: ['BCA'], courseType: 'Lab' },
    { courseCode: 'BCA515', courseName: 'Mobile App Dev Lab', credits: 2, semester: 5, branches: ['BCA'], courseType: 'Lab' },
    { courseCode: 'BCA516', courseName: 'Summer Project', credits: 3, semester: 5, branches: ['BCA'], courseType: 'Project' },

    // SEMESTER 6
    { courseCode: 'BCA611', courseName: 'AI & Machine Learning', credits: 4, semester: 6, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA612', courseName: 'Information Security', credits: 4, semester: 6, branches: ['BCA'], courseType: 'Theory' },
    { courseCode: 'BCA613', courseName: 'AI & ML Lab', credits: 2, semester: 6, branches: ['BCA'], courseType: 'Lab' },
    { courseCode: 'BCA614', courseName: 'Major Project', credits: 6, semester: 6, branches: ['BCA'], courseType: 'Project' },

    // ==================== B.Sc Chemistry ====================
    // SEMESTER 1
    { courseCode: 'CHEM111', courseName: 'Atomic Structure', credits: 4, semester: 1, branches: ['BSC-CHEM'], courseType: 'Theory' },
    { courseCode: 'CHEM112', courseName: 'States of Matter & Ionic Equilibrium', credits: 4, semester: 1, branches: ['BSC-CHEM'], courseType: 'Theory' },
    { courseCode: 'CHEM113', courseName: 'General Chemistry Lab-I (Titration)', credits: 2, semester: 1, branches: ['BSC-CHEM'], courseType: 'Lab' },

    // SEMESTER 2
    { courseCode: 'CHEM211', courseName: 'Chemical Bonding & Molecular Structure', credits: 4, semester: 2, branches: ['BSC-CHEM'], courseType: 'Theory' },
    { courseCode: 'CHEM212', courseName: 'Chemical Thermodynamics', credits: 4, semester: 2, branches: ['BSC-CHEM'], courseType: 'Theory' },
    { courseCode: 'CHEM213', courseName: 'General Chemistry Lab-II', credits: 2, semester: 2, branches: ['BSC-CHEM'], courseType: 'Lab' },

    // SEMESTER 3
    { courseCode: 'CHEM311', courseName: 'Fundamentals of Organic Chemistry', credits: 4, semester: 3, branches: ['BSC-CHEM'], courseType: 'Theory' },
    { courseCode: 'CHEM312', courseName: 'Phase Equilibrium & Conductance', credits: 4, semester: 3, branches: ['BSC-CHEM'], courseType: 'Theory' },
    { courseCode: 'CHEM313', courseName: 'Organic Chemistry Lab-I', credits: 2, semester: 3, branches: ['BSC-CHEM'], courseType: 'Lab' },
    { courseCode: 'CHEM314', courseName: 'Physical Chemistry Lab-I', credits: 1, semester: 3, branches: ['BSC-CHEM'], courseType: 'Lab' },

    // SEMESTER 4
    { courseCode: 'CHEM411', courseName: 'Coordination Chemistry', credits: 4, semester: 4, branches: ['BSC-CHEM'], courseType: 'Theory' },
    { courseCode: 'CHEM412', courseName: 'Electrochemistry', credits: 4, semester: 4, branches: ['BSC-CHEM'], courseType: 'Theory' },
    { courseCode: 'CHEM413', courseName: 'Inorganic Chemistry Lab-I', credits: 2, semester: 4, branches: ['BSC-CHEM'], courseType: 'Lab' },
    { courseCode: 'CHEM414', courseName: 'Physical Chemistry Lab-II', credits: 1, semester: 4, branches: ['BSC-CHEM'], courseType: 'Lab' },

    // SEMESTER 5
    { courseCode: 'CHEM511', courseName: 'Organic Chemistry-II (Functional Groups)', credits: 4, semester: 5, branches: ['BSC-CHEM'], courseType: 'Theory' },
    { courseCode: 'CHEM512', courseName: 'Quantum Chemistry', credits: 4, semester: 5, branches: ['BSC-CHEM'], courseType: 'Theory' },
    { courseCode: 'CHEM513', courseName: 'Organic Chemistry Lab-II', credits: 2, semester: 5, branches: ['BSC-CHEM'], courseType: 'Lab' },
    { courseCode: 'CHEM514', courseName: 'Physical Chemistry Lab-III', credits: 1, semester: 5, branches: ['BSC-CHEM'], courseType: 'Lab' },

    // SEMESTER 6
    { courseCode: 'CHEM611', courseName: 'Inorganic Chemistry-II (Organometallics)', credits: 4, semester: 6, branches: ['BSC-CHEM'], courseType: 'Theory' },
    { courseCode: 'CHEM612', courseName: 'Spectroscopy', credits: 4, semester: 6, branches: ['BSC-CHEM'], courseType: 'Theory' },
    { courseCode: 'CHEM613', courseName: 'Inorganic Chemistry Lab-II', credits: 2, semester: 6, branches: ['BSC-CHEM'], courseType: 'Lab' },
    { courseCode: 'CHEM614', courseName: 'Project/Dissertation', credits: 4, semester: 6, branches: ['BSC-CHEM'], courseType: 'Project' },

    // ==================== B.Sc Mathematics ====================
    // SEMESTER 1
    { courseCode: 'MATH111', courseName: 'Calculus', credits: 4, semester: 1, branches: ['BSC-MATH'], courseType: 'Theory' },
    { courseCode: 'MATH112', courseName: 'Algebra', credits: 4, semester: 1, branches: ['BSC-MATH'], courseType: 'Theory' },
    { courseCode: 'MATH113', courseName: 'Calculus Lab (using software)', credits: 2, semester: 1, branches: ['BSC-MATH'], courseType: 'Lab' },

    // SEMESTER 2
    { courseCode: 'MATH211', courseName: 'Real Analysis', credits: 4, semester: 2, branches: ['BSC-MATH'], courseType: 'Theory' },
    { courseCode: 'MATH212', courseName: 'Differential Equations', credits: 4, semester: 2, branches: ['BSC-MATH'], courseType: 'Theory' },
    { courseCode: 'MATH213', courseName: 'Differential Equations Lab', credits: 2, semester: 2, branches: ['BSC-MATH'], courseType: 'Lab' },

    // SEMESTER 3
    { courseCode: 'MATH311', courseName: 'Theory of Real Functions', credits: 4, semester: 3, branches: ['BSC-MATH'], courseType: 'Theory' },
    { courseCode: 'MATH312', courseName: 'Group Theory-I', credits: 4, semester: 3, branches: ['BSC-MATH'], courseType: 'Theory' },
    { courseCode: 'MATH313', courseName: 'PDE & Systems of ODE', credits: 4, semester: 3, branches: ['BSC-MATH'], courseType: 'Theory' },
    { courseCode: 'MATH314', courseName: 'PDE & ODE Lab', credits: 2, semester: 3, branches: ['BSC-MATH'], courseType: 'Lab' },

    // SEMESTER 4
    { courseCode: 'MATH411', courseName: 'Numerical Methods', credits: 4, semester: 4, branches: ['BSC-MATH'], courseType: 'Theory' },
    { courseCode: 'MATH412', courseName: 'Riemann Integration', credits: 4, semester: 4, branches: ['BSC-MATH'], courseType: 'Theory' },
    { courseCode: 'MATH413', courseName: 'Ring Theory', credits: 4, semester: 4, branches: ['BSC-MATH'], courseType: 'Theory' },
    { courseCode: 'MATH414', courseName: 'Numerical Methods Lab', credits: 2, semester: 4, branches: ['BSC-MATH'], courseType: 'Lab' },

    // SEMESTER 5
    { courseCode: 'MATH511', courseName: 'Multivariate Calculus', credits: 4, semester: 5, branches: ['BSC-MATH'], courseType: 'Theory' },
    { courseCode: 'MATH512', courseName: 'Group Theory-II', credits: 4, semester: 5, branches: ['BSC-MATH'], courseType: 'Theory' },
    { courseCode: 'MATH513', courseName: 'Multivariate Calculus Lab', credits: 2, semester: 5, branches: ['BSC-MATH'], courseType: 'Lab' },

    // SEMESTER 6
    { courseCode: 'MATH611', courseName: 'Metric Spaces', credits: 4, semester: 6, branches: ['BSC-MATH'], courseType: 'Theory' },
    { courseCode: 'MATH612', courseName: 'Complex Analysis', credits: 4, semester: 6, branches: ['BSC-MATH'], courseType: 'Theory' },
    { courseCode: 'MATH613', courseName: 'Project Work', credits: 4, semester: 6, branches: ['BSC-MATH'], courseType: 'Project' },

    // ==================== BAJMC (Journalism & Mass Communication) ====================
    // SEMESTER 1
    { courseCode: 'BAJMC111', courseName: 'Intro to Communication & Media', credits: 4, semester: 1, branches: ['BAJMC'], courseType: 'Theory' },
    { courseCode: 'BAJMC112', courseName: 'Indian Political System', credits: 3, semester: 1, branches: ['BAJMC'], courseType: 'Theory' },
    { courseCode: 'BAJMC113', courseName: 'Hindi/English Literature', credits: 3, semester: 1, branches: ['BAJMC'], courseType: 'Theory' },
    { courseCode: 'BAJMC114', courseName: 'Computer Lab for Media', credits: 2, semester: 1, branches: ['BAJMC'], courseType: 'Lab' },
    { courseCode: 'BAJMC115', courseName: 'Writing Skills', credits: 2, semester: 1, branches: ['BAJMC'], courseType: 'Lab' },

    // SEMESTER 2
    { courseCode: 'BAJMC211', courseName: 'Media Law & Ethics', credits: 4, semester: 2, branches: ['BAJMC'], courseType: 'Theory' },
    { courseCode: 'BAJMC212', courseName: 'Global Media Scenario', credits: 3, semester: 2, branches: ['BAJMC'], courseType: 'Theory' },
    { courseCode: 'BAJMC213', courseName: 'Socio-Economic System', credits: 3, semester: 2, branches: ['BAJMC'], courseType: 'Theory' },
    { courseCode: 'BAJMC214', courseName: 'Photography Lab', credits: 2, semester: 2, branches: ['BAJMC'], courseType: 'Lab' },
    { courseCode: 'BAJMC215', courseName: 'Design & Graphics Lab', credits: 2, semester: 2, branches: ['BAJMC'], courseType: 'Lab' },

    // SEMESTER 3
    { courseCode: 'BAJMC311', courseName: 'Reporting & Editing', credits: 4, semester: 3, branches: ['BAJMC'], courseType: 'Theory' },
    { courseCode: 'BAJMC312', courseName: 'Advertising Principles', credits: 4, semester: 3, branches: ['BAJMC'], courseType: 'Theory' },
    { courseCode: 'BAJMC313', courseName: 'Reporting & Editing Lab', credits: 2, semester: 3, branches: ['BAJMC'], courseType: 'Lab' },
    { courseCode: 'BAJMC314', courseName: 'Advertising Lab', credits: 2, semester: 3, branches: ['BAJMC'], courseType: 'Lab' },

    // SEMESTER 4
    { courseCode: 'BAJMC411', courseName: 'Broadcast Journalism (Radio & TV)', credits: 4, semester: 4, branches: ['BAJMC'], courseType: 'Theory' },
    { courseCode: 'BAJMC412', courseName: 'Public Relations', credits: 4, semester: 4, branches: ['BAJMC'], courseType: 'Theory' },
    { courseCode: 'BAJMC413', courseName: 'TV/Radio Production Lab', credits: 2, semester: 4, branches: ['BAJMC'], courseType: 'Lab' },
    { courseCode: 'BAJMC414', courseName: 'PR Campaigns', credits: 2, semester: 4, branches: ['BAJMC'], courseType: 'Lab' },

    // SEMESTER 5
    { courseCode: 'BAJMC511', courseName: 'New Media & Web Journalism', credits: 4, semester: 5, branches: ['BAJMC'], courseType: 'Theory' },
    { courseCode: 'BAJMC512', courseName: 'Media Management', credits: 4, semester: 5, branches: ['BAJMC'], courseType: 'Theory' },
    { courseCode: 'BAJMC513', courseName: 'Web Design Lab', credits: 2, semester: 5, branches: ['BAJMC'], courseType: 'Lab' },
    { courseCode: 'BAJMC514', courseName: 'Documentary Production', credits: 2, semester: 5, branches: ['BAJMC'], courseType: 'Lab' },

    // SEMESTER 6
    { courseCode: 'BAJMC611', courseName: 'Media Research', credits: 4, semester: 6, branches: ['BAJMC'], courseType: 'Theory' },
    { courseCode: 'BAJMC612', courseName: 'Development Communication', credits: 4, semester: 6, branches: ['BAJMC'], courseType: 'Theory' },
    { courseCode: 'BAJMC613', courseName: 'Dissertation / Internship Report', credits: 6, semester: 6, branches: ['BAJMC'], courseType: 'Project' },

    // ==================== B.A. Psychology ====================
    { courseCode: 'PSY111', courseName: 'Introduction to Psychology', credits: 4, semester: 1, branches: ['BA-PSY'], courseType: 'Theory' },
    { courseCode: 'PSY112', courseName: 'Statistical Methods for Psychological Research-I', credits: 4, semester: 1, branches: ['BA-PSY'], courseType: 'Theory' },
    { courseCode: 'PSY211', courseName: 'Biopsychology', credits: 4, semester: 2, branches: ['BA-PSY'], courseType: 'Theory' },
    { courseCode: 'PSY212', courseName: 'Statistical Methods-II', credits: 4, semester: 2, branches: ['BA-PSY'], courseType: 'Theory' },
    { courseCode: 'PSY311', courseName: 'Development of Psychological Thought', credits: 4, semester: 3, branches: ['BA-PSY'], courseType: 'Theory' },
    { courseCode: 'PSY312', courseName: 'Psychological Research', credits: 4, semester: 3, branches: ['BA-PSY'], courseType: 'Theory' },
    { courseCode: 'PSY313', courseName: 'Social Psychology', credits: 4, semester: 3, branches: ['BA-PSY'], courseType: 'Theory' },
    { courseCode: 'PSY411', courseName: 'Developmental Psychology', credits: 4, semester: 4, branches: ['BA-PSY'], courseType: 'Theory' },
    { courseCode: 'PSY412', courseName: 'Understanding Psychological Disorders', credits: 4, semester: 4, branches: ['BA-PSY'], courseType: 'Theory' },
    { courseCode: 'PSY511', courseName: 'Organizational Behavior', credits: 4, semester: 5, branches: ['BA-PSY'], courseType: 'Theory' },
    { courseCode: 'PSY512', courseName: 'Counseling Psychology', credits: 4, semester: 5, branches: ['BA-PSY'], courseType: 'Theory' },
    { courseCode: 'PSY611', courseName: 'Clinical Psychology', credits: 4, semester: 6, branches: ['BA-PSY'], courseType: 'Theory' },
    { courseCode: 'PSY612', courseName: 'Human Resource Management (Elective)', credits: 4, semester: 6, branches: ['BA-PSY'], courseType: 'Theory', isElective: true },

    // ==================== B.A. Economics ====================
    { courseCode: 'ECO111', courseName: 'Introductory Microeconomics', credits: 4, semester: 1, branches: ['BA-ECO'], courseType: 'Theory' },
    { courseCode: 'ECO112', courseName: 'Mathematical Methods for Economics-I', credits: 4, semester: 1, branches: ['BA-ECO'], courseType: 'Theory' },
    { courseCode: 'ECO211', courseName: 'Introductory Macroeconomics', credits: 4, semester: 2, branches: ['BA-ECO'], courseType: 'Theory' },
    { courseCode: 'ECO212', courseName: 'Mathematical Methods-II', credits: 4, semester: 2, branches: ['BA-ECO'], courseType: 'Theory' },
    { courseCode: 'ECO311', courseName: 'Intermediate Microeconomics-I', credits: 4, semester: 3, branches: ['BA-ECO'], courseType: 'Theory' },
    { courseCode: 'ECO312', courseName: 'Intermediate Macroeconomics-I', credits: 4, semester: 3, branches: ['BA-ECO'], courseType: 'Theory' },
    { courseCode: 'ECO313', courseName: 'Statistical Methods', credits: 4, semester: 3, branches: ['BA-ECO'], courseType: 'Theory' },
    { courseCode: 'ECO411', courseName: 'Intermediate Microeconomics-II', credits: 4, semester: 4, branches: ['BA-ECO'], courseType: 'Theory' },
    { courseCode: 'ECO412', courseName: 'Intermediate Macroeconomics-II', credits: 4, semester: 4, branches: ['BA-ECO'], courseType: 'Theory' },
    { courseCode: 'ECO413', courseName: 'Introductory Econometrics', credits: 4, semester: 4, branches: ['BA-ECO'], courseType: 'Theory' },
    { courseCode: 'ECO511', courseName: 'Indian Economy-I', credits: 4, semester: 5, branches: ['BA-ECO'], courseType: 'Theory' },
    { courseCode: 'ECO512', courseName: 'Development Economics-I', credits: 4, semester: 5, branches: ['BA-ECO'], courseType: 'Theory' },
    { courseCode: 'ECO611', courseName: 'Indian Economy-II', credits: 4, semester: 6, branches: ['BA-ECO'], courseType: 'Theory' },
    { courseCode: 'ECO612', courseName: 'Development Economics-II', credits: 4, semester: 6, branches: ['BA-ECO'], courseType: 'Theory' },

    // ==================== B.A. English ====================
    { courseCode: 'ENG111', courseName: 'Indian Classical Literature', credits: 4, semester: 1, branches: ['BA-ENG'], courseType: 'Theory' },
    { courseCode: 'ENG112', courseName: 'European Classical Literature', credits: 4, semester: 1, branches: ['BA-ENG'], courseType: 'Theory' },
    { courseCode: 'ENG211', courseName: 'Indian Writing in English', credits: 4, semester: 2, branches: ['BA-ENG'], courseType: 'Theory' },
    { courseCode: 'ENG212', courseName: 'British Poetry and Drama (14th-17th Century)', credits: 4, semester: 2, branches: ['BA-ENG'], courseType: 'Theory' },
    { courseCode: 'ENG311', courseName: 'American Literature', credits: 4, semester: 3, branches: ['BA-ENG'], courseType: 'Theory' },
    { courseCode: 'ENG312', courseName: 'Popular Literature', credits: 4, semester: 3, branches: ['BA-ENG'], courseType: 'Theory' },
    { courseCode: 'ENG313', courseName: 'British Poetry and Drama (17th-18th Century)', credits: 4, semester: 3, branches: ['BA-ENG'], courseType: 'Theory' },
    { courseCode: 'ENG411', courseName: 'British Literature (18th Century)', credits: 4, semester: 4, branches: ['BA-ENG'], courseType: 'Theory' },
    { courseCode: 'ENG412', courseName: 'British Romantic Literature', credits: 4, semester: 4, branches: ['BA-ENG'], courseType: 'Theory' },
    { courseCode: 'ENG413', courseName: 'British Literature (19th Century)', credits: 4, semester: 4, branches: ['BA-ENG'], courseType: 'Theory' },
    { courseCode: 'ENG511', courseName: "Women's Writing", credits: 4, semester: 5, branches: ['BA-ENG'], courseType: 'Theory' },
    { courseCode: 'ENG512', courseName: 'British Literature (Early 20th Century)', credits: 4, semester: 5, branches: ['BA-ENG'], courseType: 'Theory' },
    { courseCode: 'ENG611', courseName: 'Modern European Drama', credits: 4, semester: 6, branches: ['BA-ENG'], courseType: 'Theory' },
    { courseCode: 'ENG612', courseName: 'Postcolonial Literatures', credits: 4, semester: 6, branches: ['BA-ENG'], courseType: 'Theory' }
];

async function seedFinalMUJPrograms() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode');
        console.log('✅ Connected to MongoDB');

        // Get existing courses count
        const existingCount = await SemesterCourse.countDocuments();
        console.log(`📊 Existing courses in DB: ${existingCount}`);

        // Insert NEW programs (BCA, B.Sc, B.A.)
        const insertedCourses = await SemesterCourse.insertMany(newFacultyPrograms);
        console.log(`\n✅ Successfully added ${insertedCourses.length} NEW courses!`);

        console.log('\n📚 New Programs Added:');
        console.log('━'.repeat(80));

        const programs = {
            'BCA': 'BCA',
            'B.Sc Chemistry': 'BSC-CHEM',
            'B.Sc Mathematics': 'BSC-MATH',
            'B.A. Journalism & Mass Comm': 'BAJMC',
            'B.A. Psychology': 'BA-PSY',
            'B.A. Economics': 'BA-ECO',
            'B.A. English': 'BA-ENG'
        };

        for (const [name, code] of Object.entries(programs)) {
            const programCourses = newFacultyPrograms.filter(c => c.branches.includes(code));
            const totalCredits = programCourses.reduce((sum, c) => sum + c.credits, 0);
            console.log(`${name}: ${programCourses.length} courses (${totalCredits} credits)`);
        }

        const newTotal = await SemesterCourse.countDocuments();
        console.log('\n' + '━'.repeat(80));
        console.log(`🎯 **TOTAL COURSES IN DATABASE**: ${newTotal}`);
        console.log(`   Previous: ${existingCount} | Added: ${insertedCourses.length} | Total: ${newTotal}`);
        console.log('━'.repeat(80));

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding programs:', error);
        process.exit(1);
    }
}

seedFinalMUJPrograms();
