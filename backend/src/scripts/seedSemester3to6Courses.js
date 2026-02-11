// Seed Script: Add Semester 3-6 Courses for Multiple Branches
// Based on MUJ Curriculum Data (B.Tech Scheme 2019 Onwards)

const mongoose = require('mongoose');
const SemesterCourse = require('../models/mongo/SemesterCourse');
require('dotenv').config();

const semester3to6Courses = [
    // ==================== CSE - SEMESTER 3 ====================
    { courseCode: 'MA301-CSE', courseName: 'Engineering Mathematics - III', credits: 4, semester: 3, branches: ['CSE'], courseType: 'Theory' },
    { courseCode: 'CS311', courseName: 'Data Communications', credits: 3, semester: 3, branches: ['CSE'], courseType: 'Theory' },
    { courseCode: 'CS312', courseName: 'Computer System Architecture', credits: 3, semester: 3, branches: ['CSE'], courseType: 'Theory' },
    { courseCode: 'CS313', courseName: 'Data Structures & Algorithms (DSA)', credits: 4, semester: 3, branches: ['CSE'], courseType: 'Theory', prerequisites: ['CS301'] },
    { courseCode: 'CS314', courseName: 'Object Oriented Programming (OOP)', credits: 3, semester: 3, branches: ['CSE'], courseType: 'Theory', prerequisites: ['CS303'] },
    { courseCode: 'CS315', courseName: 'Data Structures & Algorithms Lab', credits: 2, semester: 3, branches: ['CSE'], courseType: 'Lab' },
    { courseCode: 'CS316', courseName: 'Object Oriented Programming Lab', credits: 1, semester: 3, branches: ['CSE'], courseType: 'Lab' },

    // ==================== CSE - SEMESTER 4 ====================
    { courseCode: 'EC401-CSE', courseName: 'Economics', credits: 3, semester: 4, branches: ['CSE'], courseType: 'Theory' },
    { courseCode: 'MA401-CSE', courseName: 'Engineering Mathematics - IV', credits: 4, semester: 4, branches: ['CSE'], courseType: 'Theory', prerequisites: ['MA301-CSE'] },
    { courseCode: 'CS411', courseName: 'Operating Systems (OS)', credits: 4, semester: 4, branches: ['CSE'], courseType: 'Theory', prerequisites: ['CS403'] },
    { courseCode: 'CS412', courseName: 'Relational Database Management Systems (DBMS)', credits: 3, semester: 4, branches: ['CSE'], courseType: 'Theory', prerequisites: ['CS401'] },
    { courseCode: 'CS413', courseName: 'Computer Organization', credits: 3, semester: 4, branches: ['CSE'], courseType: 'Theory' },
    { courseCode: 'CS414', courseName: 'Operating Systems Lab', credits: 1, semester: 4, branches: ['CSE'], courseType: 'Lab' },
    { courseCode: 'CS415', courseName: 'RDBMS Lab', credits: 1, semester: 4, branches: ['CSE'], courseType: 'Lab', prerequisites: ['CS402'] },
    { courseCode: 'CS416', courseName: 'Web Technology Lab', credits: 2, semester: 4, branches: ['CSE'], courseType: 'Lab' },

    // ==================== CSE - SEMESTER 5 ====================
    { courseCode: 'CS511', courseName: 'Artificial Intelligence & Soft Computing', credits: 4, semester: 5, branches: ['CSE'], courseType: 'Theory' },
    { courseCode: 'CS512', courseName: 'Design & Analysis of Algorithms (DAA)', credits: 4, semester: 5, branches: ['CSE'], courseType: 'Theory', prerequisites: ['CS404'] },
    { courseCode: 'CS513', courseName: 'Automata Theory & Compiler Design', credits: 4, semester: 5, branches: ['CSE'], courseType: 'Theory' },
    { courseCode: 'CS514', courseName: 'Computer Networks', credits: 3, semester: 5, branches: ['CSE'], courseType: 'Theory', prerequisites: ['CS405'] },
    { courseCode: 'CS515', courseName: 'Design & Analysis of Algorithms Lab', credits: 2, semester: 5, branches: ['CSE'], courseType: 'Lab' },
    { courseCode: 'CS516', courseName: 'AI & Soft Computing Lab', credits: 1, semester: 5, branches: ['CSE'], courseType: 'Lab' },
    { courseCode: 'CS517', courseName: 'Computer Networks Lab', credits: 1, semester: 5, branches: ['CSE'], courseType: 'Lab' },

    // ==================== CSE - SEMESTER 6 ====================
    { courseCode: 'MG601-CSE', courseName: 'Organization and Management', credits: 3, semester: 6, branches: ['CSE'], courseType: 'Theory' },
    { courseCode: 'CS611', courseName: 'Software Engineering', credits: 3, semester: 6, branches: ['CSE'], courseType: 'Theory' },
    { courseCode: 'CS612', courseName: 'Information Systems Security', credits: 3, semester: 6, branches: ['CSE'], courseType: 'Theory' },
    { courseCode: 'CS613', courseName: 'Data Science and Machine Learning', credits: 4, semester: 6, branches: ['CSE'], courseType: 'Theory' },
    { courseCode: 'CS614', courseName: 'Software Engineering Lab', credits: 1, semester: 6, branches: ['CSE'], courseType: 'Lab' },
    { courseCode: 'CS615', courseName: 'Information Systems Security Lab', credits: 1, semester: 6, branches: ['CSE'], courseType: 'Lab' },
    { courseCode: 'CS616', courseName: 'Minor Project', credits: 3, semester: 6, branches: ['CSE'], courseType: 'Project' },

    // ==================== EL (Electrical & Computer) - SEMESTER 3 ====================
    { courseCode: 'VE301-EL', courseName: 'Value Ethics & Governance', credits: 2, semester: 3, branches: ['ECE-EC'], courseType: 'Theory' },
    { courseCode: 'MA301-EL', courseName: 'Engineering Mathematics - III', credits: 4, semester: 3, branches: ['ECE-EC'], courseType: 'Theory' },
    { courseCode: 'EL311', courseName: 'Computer Organization & Architecture', credits: 3, semester: 3, branches: ['ECE-EC'], courseType: 'Theory' },
    { courseCode: 'EL312', courseName: 'Object Oriented Programming', credits: 3, semester: 3, branches: ['ECE-EC'], courseType: 'Theory' },
    { courseCode: 'EL313', courseName: 'Analog & Digital Systems', credits: 4, semester: 3, branches: ['ECE-EC'], courseType: 'Theory' },
    { courseCode: 'EL314', courseName: 'Sensor & Sensor Circuits', credits: 3, semester: 3, branches: ['ECE-EC'], courseType: 'Theory' },
    { courseCode: 'EL315', courseName: 'Programming Lab-I', credits: 2, semester: 3, branches: ['ECE-EC'], courseType: 'Lab' },
    { courseCode: 'EL316', courseName: 'Analog & Digital System Design Lab', credits: 1, semester: 3, branches: ['ECE-EC'], courseType: 'Lab' },
    { courseCode: 'EL317', courseName: 'System Simulation & Virtual Instrumentation Lab', credits: 1, semester: 3, branches: ['ECE-EC'], courseType: 'Lab' },

    // ==================== EL - SEMESTER 4 ====================
    { courseCode: 'EC401-EL', courseName: 'Economics', credits: 3, semester: 4, branches: ['ECE-EC'], courseType: 'Theory' },
    { courseCode: 'MA401-EL', courseName: 'Engineering Mathematics - IV', credits: 4, semester: 4, branches: ['ECE-EC'], courseType: 'Theory' },
    { courseCode: 'EL411', courseName: 'Operating Systems', credits: 3, semester: 4, branches: ['ECE-EC'], courseType: 'Theory' },
    { courseCode: 'EL412', courseName: 'Network Analysis & Synthesis', credits: 4, semester: 4, branches: ['ECE-EC'], courseType: 'Theory' },
    { courseCode: 'EL413', courseName: 'Electrical Machines', credits: 4, semester: 4, branches: ['ECE-EC'], courseType: 'Theory' },
    { courseCode: 'EL414', courseName: 'Programming Lab-II', credits: 2, semester: 4, branches: ['ECE-EC'], courseType: 'Lab' },
    { courseCode: 'EL415', courseName: 'Electrical Machines Lab', credits: 1, semester: 4, branches: ['ECE-EC'], courseType: 'Lab' },
    { courseCode: 'EL416', courseName: 'Project Based Learning Lab', credits: 1, semester: 4, branches: ['ECE-EC'], courseType: 'Lab' },

    // ==================== EL - SEMESTER 5 ====================
    { courseCode: 'EL511', courseName: 'Data Structures & Algorithms', credits: 4, semester: 5, branches: ['ECE-EC'], courseType: 'Theory' },
    { courseCode: 'EL512', courseName: 'Microcontroller based System Design', credits: 4, semester: 5, branches: ['ECE-EC'], courseType: 'Theory' },
    { courseCode: 'EL513', courseName: 'Control System', credits: 4, semester: 5, branches: ['ECE-EC'], courseType: 'Theory' },
    { courseCode: 'EL514', courseName: 'Data Structure Lab', credits: 2, semester: 5, branches: ['ECE-EC'], courseType: 'Lab' },
    { courseCode: 'EL515', courseName: 'Microcontroller Lab', credits: 1, semester: 5, branches: ['ECE-EC'], courseType: 'Lab' },
    { courseCode: 'EL516', courseName: 'Control & Automation Lab', credits: 1, semester: 5, branches: ['ECE-EC'], courseType: 'Lab' },

    // ==================== EL - SEMESTER 6 ====================
    { courseCode: 'EL611', courseName: 'Computer Networks', credits: 3, semester: 6, branches: ['ECE-EC'], courseType: 'Theory' },
    { courseCode: 'EL612', courseName: 'Data Base Management System (DBMS)', credits: 3, semester: 6, branches: ['ECE-EC'], courseType: 'Theory' },
    { courseCode: 'EL613', courseName: 'Power Electronics & Drives', credits: 4, semester: 6, branches: ['ECE-EC'], courseType: 'Theory' },
    { courseCode: 'EL614', courseName: 'DBMS Lab', credits: 1, semester: 6, branches: ['ECE-EC'], courseType: 'Lab' },
    { courseCode: 'EL615', courseName: 'Power Electronics Lab', credits: 1, semester: 6, branches: ['ECE-EC'], courseType: 'Lab' },
    { courseCode: 'EL616', courseName: 'Minor Project-1', credits: 3, semester: 6, branches: ['ECE-EC'], courseType: 'Project' },

    // ==================== ECE - SEMESTER 3 ====================
    { courseCode: 'SP301-ECE', courseName: 'Statistics & Probability', credits: 4, semester: 3, branches: ['ECE'], courseType: 'Theory' },
    { courseCode: 'MT301-ECE', courseName: 'Management of Technology', credits: 2, semester: 3, branches: ['ECE'], courseType: 'Theory' },
    { courseCode: 'EC311', courseName: 'Electronic Devices-I', credits: 4, semester: 3, branches: ['ECE'], courseType: 'Theory' },
    { courseCode: 'EC312', courseName: 'Digital Electronics', credits: 3, semester: 3, branches: ['ECE'], courseType: 'Theory' },
    { courseCode: 'EC313', courseName: 'Signals and Systems', credits: 4, semester: 3, branches: ['ECE'], courseType: 'Theory', prerequisites: ['EC301'] },
    { courseCode: 'EC314', courseName: 'Electronic Devices Lab-I', credits: 1, semester: 3, branches: ['ECE'], courseType: 'Lab' },
    { courseCode: 'EC315', courseName: 'Digital Electronics Lab', credits: 1, semester: 3, branches: ['ECE'], courseType: 'Lab' },
    { courseCode: 'EC316', courseName: 'Project-based Learning 1', credits: 2, semester: 3, branches: ['ECE'], courseType: 'Project' },

    // ==================== ECE - SEMESTER 4 ====================
    { courseCode: 'EC401-ECE', courseName: 'Engineering Economics', credits: 3, semester: 4, branches: ['ECE'], courseType: 'Theory' },
    { courseCode: 'EC411', courseName: 'Electronic Devices-II', credits: 4, semester: 4, branches: ['ECE'], courseType: 'Theory', prerequisites: ['EC311'] },
    { courseCode: 'EC412', courseName: 'Computer & Processor Architecture', credits: 3, semester: 4, branches: ['ECE'], courseType: 'Theory' },
    { courseCode: 'EC414', courseName: 'SPICE Lab', credits: 1, semester: 4, branches: ['ECE'], courseType: 'Lab' },
    { courseCode: 'EC415', courseName: 'Computer & Processor Architecture Lab', credits: 1, semester: 4, branches: ['ECE'], courseType: 'Lab' },
    { courseCode: 'EC416', courseName: 'Project-based Learning 2', credits: 2, semester: 4, branches: ['ECE'], courseType: 'Project' },

    // ==================== ECE - SEMESTER 5 ====================
    { courseCode: 'EC511', courseName: 'Digital VLSI Design', credits: 4, semester: 5, branches: ['ECE'], courseType: 'Theory' },
    { courseCode: 'EC512', courseName: 'Analog and Digital Communication', credits: 4, semester: 5, branches: ['ECE'], courseType: 'Theory' },
    { courseCode: 'EC514', courseName: 'IC Design Lab', credits: 1, semester: 5, branches: ['ECE'], courseType: 'Lab' },
    { courseCode: 'EC515', courseName: 'Communication System Lab', credits: 1, semester: 5, branches: ['ECE'], courseType: 'Lab' },
    { courseCode: 'EC516', courseName: 'Project-based Learning 3', credits: 2, semester: 5, branches: ['ECE'], courseType: 'Project' },

    // ==================== ECE - SEMESTER 6 ====================
    { courseCode: 'EC611', courseName: 'Optical Communication', credits: 3, semester: 6, branches: ['ECE'], courseType: 'Theory' },
    { courseCode: 'EC612', courseName: 'Program Electives', credits: 6, semester: 6, branches: ['ECE'], courseType: 'Theory', isElective: true, electiveCategory: 'Departmental Elective' },
    { courseCode: 'EC614', courseName: 'Optical Communication Lab', credits: 1, semester: 6, branches: ['ECE'], courseType: 'Lab' },
    { courseCode: 'EC615', courseName: 'Advanced System Design Lab', credits: 1, semester: 6, branches: ['ECE'], courseType: 'Lab' },
    { courseCode: 'EC616', courseName: 'Project-based Learning 4', credits: 2, semester: 6, branches: ['ECE'], courseType: 'Project' },

    // ==================== VLSI - SEMESTER 3 ====================
    { courseCode: 'SP301-VLSI', courseName: 'Statistics & Probability', credits: 4, semester: 3, branches: ['VLSI'], courseType: 'Theory' },
    { courseCode: 'VL311', courseName: 'Electronic Devices-I', credits: 4, semester: 3, branches: ['VLSI'], courseType: 'Theory' },
    { courseCode: 'VL312', courseName: 'Digital Electronics', credits: 3, semester: 3, branches: ['VLSI'], courseType: 'Theory' },
    { courseCode: 'VL313', courseName: 'Circuits & Network Theory', credits: 4, semester: 3, branches: ['VLSI'], courseType: 'Theory' },
    { courseCode: 'VL314', courseName: 'Electronic Devices Lab-I', credits: 1, semester: 3, branches: ['VLSI'], courseType: 'Lab' },
    { courseCode: 'VL315', courseName: 'Digital Electronics Lab', credits: 1, semester: 3, branches: ['VLSI'], courseType: 'Lab' },

    // ==================== VLSI - SEMESTER 4 ====================
    { courseCode: 'EC401-VLSI', courseName: 'Engineering Economics', credits: 3, semester: 4, branches: ['VLSI'], courseType: 'Theory' },
    { courseCode: 'VL411', courseName: 'Electronic Devices-II', credits: 4, semester: 4, branches: ['VLSI'], courseType: 'Theory', prerequisites: ['VL311'] },
    { courseCode: 'VL412', courseName: 'Computer & Processor Architecture', credits: 3, semester: 4, branches: ['VLSI'], courseType: 'Theory' },
    { courseCode: 'VL414', courseName: 'SPICE Lab', credits: 1, semester: 4, branches: ['VLSI'], courseType: 'Lab' },
    { courseCode: 'VL415', courseName: 'Computer Architecture Lab', credits: 1, semester: 4, branches: ['VLSI'], courseType: 'Lab' },

    // ==================== VLSI - SEMESTER 5 ====================
    { courseCode: 'VL511', courseName: 'Digital VLSI Design', credits: 4, semester: 5, branches: ['VLSI'], courseType: 'Theory' },
    { courseCode: 'VL512', courseName: 'Semiconductor Device Fabrication', credits: 4, semester: 5, branches: ['VLSI'], courseType: 'Theory' },
    { courseCode: 'VL514', courseName: 'IC Design Lab', credits: 1, semester: 5, branches: ['VLSI'], courseType: 'Lab' },
    { courseCode: 'VL515', courseName: 'Device Fabrication Lab', credits: 1, semester: 5, branches: ['VLSI'], courseType: 'Lab' },

    // ==================== VLSI - SEMESTER 6 ====================
    { courseCode: 'VL611', courseName: 'System Verilog for Verification', credits: 3, semester: 6, branches: ['VLSI'], courseType: 'Theory' },
    { courseCode: 'VL614', courseName: 'System Verilog Lab', credits: 1, semester: 6, branches: ['VLSI'], courseType: 'Lab' },
    { courseCode: 'VL615', courseName: 'Advanced System Design Lab', credits: 1, semester: 6, branches: ['VLSI'], courseType: 'Lab' },

    // ==================== Robotics & AI - SEMESTER 3 ====================
    { courseCode: 'SP301-RAI', courseName: 'Statistics & Probability', credits: 4, semester: 3, branches: ['RAI'], courseType: 'Theory' },
    { courseCode: 'RA311', courseName: 'Digital Systems and Integrated Circuits', credits: 4, semester: 3, branches: ['RAI'], courseType: 'Theory' },
    { courseCode: 'RA312', courseName: 'Robot Kinematics and Dynamics', credits: 4, semester: 3, branches: ['RAI'], courseType: 'Theory' },
    { courseCode: 'RA313', courseName: 'Sensors and Actuators for Robots', credits: 3, semester: 3, branches: ['RAI'], courseType: 'Theory' },
    { courseCode: 'MT301-RAI', courseName: 'Technology Management', credits: 2, semester: 3, branches: ['RAI'], courseType: 'Theory' },
    { courseCode: 'RA314', courseName: 'Modeling and Simulation Lab', credits: 1, semester: 3, branches: ['RAI'], courseType: 'Lab' },
    { courseCode: 'RA315', courseName: 'Sensors and Actuators Lab', credits: 1, semester: 3, branches: ['RAI'], courseType: 'Lab' },

    // ==================== Robotics & AI - SEMESTER 4 ====================
    { courseCode: 'EC401-RAI', courseName: 'Engineering Economics', credits: 3, semester: 4, branches: ['RAI'], courseType: 'Theory' },
    { courseCode: 'RA411', courseName: 'Robotics Control System', credits: 4, semester: 4, branches: ['RAI'], courseType: 'Theory' },
    { courseCode: 'RA412', courseName: 'Basics of AI and ML', credits: 4, semester: 4, branches: ['RAI'], courseType: 'Theory' },
    { courseCode: 'RA414', courseName: 'Control Lab', credits: 1, semester: 4, branches: ['RAI'], courseType: 'Lab' },
    { courseCode: 'RA415', courseName: 'AI and ML Lab', credits: 1, semester: 4, branches: ['RAI'], courseType: 'Lab' },

    // ==================== Robotics & AI - SEMESTER 5 ====================
    { courseCode: 'RA511', courseName: 'AI in Robotics', credits: 4, semester: 5, branches: ['RAI'], courseType: 'Theory' },
    { courseCode: 'RA512', courseName: 'Drives in Robotics', credits: 4, semester: 5, branches: ['RAI'], courseType: 'Theory' },
    { courseCode: 'RA514', courseName: 'Robotics Lab', credits: 1, semester: 5, branches: ['RAI'], courseType: 'Lab' },
    { courseCode: 'RA515', courseName: 'Drives Lab', credits: 1, semester: 5, branches: ['RAI'], courseType: 'Lab' },

    // ==================== Robotics & AI - SEMESTER 6 ====================
    { courseCode: 'RA611', courseName: 'Deep Neural Network', credits: 4, semester: 6, branches: ['RAI'], courseType: 'Theory' },
    { courseCode: 'RA614', courseName: 'Advance Robotics Lab', credits: 1, semester: 6, branches: ['RAI'], courseType: 'Lab' },
    { courseCode: 'RA615', courseName: 'Microcontroller Lab', credits: 1, semester: 6, branches: ['RAI'], courseType: 'Lab' },

    // ==================== Mechanical Engineering - SEMESTER 3 ====================
    { courseCode: 'EC401-ME', courseName: 'Engineering Economics', credits: 3, semester: 3, branches: ['ME'], courseType: 'Theory' },
    { courseCode: 'ME311', courseName: 'Materials Science & Metallurgy', credits: 4, semester: 3, branches: ['ME'], courseType: 'Theory' },
    { courseCode: 'ME312', courseName: 'Thermal Engineering', credits: 4, semester: 3, branches: ['ME'], courseType: 'Theory' },
    { courseCode: 'ME313', courseName: 'Strength of Materials', credits: 4, semester: 3, branches: ['ME'], courseType: 'Theory', prerequisites: ['ME303'] },
    { courseCode: 'ME314', courseName: 'Thermal Engineering-I Lab', credits: 1, semester: 3, branches: ['ME'], courseType: 'Lab' },
    { courseCode: 'ME315', courseName: 'Computer Aided Drawing Lab', credits: 1, semester: 3, branches: ['ME'], courseType: 'Lab' },

    // ==================== Mechanical Engineering - SEMESTER 4 ====================
    { courseCode: 'SP401-ME', courseName: 'Statistics & Probability', credits: 4, semester: 4, branches: ['ME'], courseType: 'Theory' },
    { courseCode: 'ME411', courseName: 'Fluid Mechanics', credits: 4, semester: 4, branches: ['ME'], courseType: 'Theory', prerequisites: ['CE302'] },
    { courseCode: 'ME412', courseName: 'Production Technology', credits: 4, semester: 4, branches: ['ME'], courseType: 'Theory', prerequisites: ['ME304'] },
    { courseCode: 'ME414', courseName: 'Production Technology Lab', credits: 1, semester: 4, branches: ['ME'], courseType: 'Lab' },
    { courseCode: 'ME415', courseName: 'Project-based Learning 2', credits: 2, semester: 4, branches: ['ME'], courseType: 'Project' },

    // ==================== Mechanical Engineering - SEMESTER 5 ====================
    { courseCode: 'ME511', courseName: 'Design of Machine Elements', credits: 4, semester: 5, branches: ['ME'], courseType: 'Theory' },
    { courseCode: 'ME512', courseName: 'Heat Transfer', credits: 4, semester: 5, branches: ['ME'], courseType: 'Theory' },
    { courseCode: 'ME514', courseName: 'Thermal Engineering II Lab', credits: 1, semester: 5, branches: ['ME'], courseType: 'Lab' },
    { courseCode: 'ME515', courseName: 'CIM & Automation Lab', credits: 1, semester: 5, branches: ['ME'], courseType: 'Lab' },

    // ==================== Mechanical Engineering - SEMESTER 6 ====================
    { courseCode: 'ME611', courseName: 'Finite Element Methods (FEM)', credits: 4, semester: 6, branches: ['ME'], courseType: 'Theory' },
    { courseCode: 'ME614', courseName: 'Smart Manufacturing Lab', credits: 1, semester: 6, branches: ['ME'], courseType: 'Lab' },
    { courseCode: 'ME615', courseName: 'Modelling & Simulation Lab', credits: 1, semester: 6, branches: ['ME'], courseType: 'Lab' },

    // ==================== Mechatronics - SEMESTER 3 ====================
    { courseCode: 'VE301-MECH', courseName: 'Value, Ethics and Governance', credits: 2, semester: 3, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MA301-MECH', courseName: 'Engineering Mathematics - III', credits: 4, semester: 3, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MC311', courseName: 'Strength of Materials', credits: 4, semester: 3, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MC312', courseName: 'Linear Integrated Circuits', credits: 3, semester: 3, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MC313', courseName: 'Theory of Machines', credits: 4, semester: 3, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MC314', courseName: 'Sensor and Instrumentation', credits: 3, semester: 3, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MC315', courseName: 'Simulation and Modelling Lab', credits: 1, semester: 3, branches: ['MECH'], courseType: 'Lab' },
    { courseCode: 'MC316', courseName: 'Sensor & Instrumentation Lab', credits: 1, semester: 3, branches: ['MECH'], courseType: 'Lab' },

    // ==================== Mechatronics - SEMESTER 4 ====================
    { courseCode: 'EC401-MECH', courseName: 'Economics', credits: 3, semester: 4, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MA401-MECH', courseName: 'Engineering Mathematics - IV', credits: 4, semester: 4, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MC411', courseName: 'Design of Machine Elements', credits: 4, semester: 4, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MC412', courseName: 'Digital System Design', credits: 3, semester: 4, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MC413', courseName: 'Fluid Mechanics', credits: 4, semester: 4, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MC414', courseName: 'Programmable Logic Controller (PLC) Lab', credits: 1, semester: 4, branches: ['MECH'], courseType: 'Lab' },
    { courseCode: 'MC415', courseName: 'Integrated Electronics Lab', credits: 1, semester: 4, branches: ['MECH'], courseType: 'Lab' },

    // ==================== Mechatronics - SEMESTER 5 ====================
    { courseCode: 'MG601-MECH', courseName: 'Organization and Management', credits: 3, semester: 5, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MC511', courseName: 'Signal and Systems', credits: 4, semester: 5, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MC512', courseName: 'Microcontroller Based System Design', credits: 4, semester: 5, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MC513', courseName: 'Pneumatic and Hydraulic Systems', credits: 3, semester: 5, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MC514', courseName: 'Linear Control Theory', credits: 4, semester: 5, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MC515', courseName: 'Microcontroller Lab', credits: 1, semester: 5, branches: ['MECH'], courseType: 'Lab' },
    { courseCode: 'MC516', courseName: 'CAD and Kinematics Lab', credits: 1, semester: 5, branches: ['MECH'], courseType: 'Lab' },
    { courseCode: 'MC517', courseName: 'Pneumatics and Hydraulics Lab', credits: 1, semester: 5, branches: ['MECH'], courseType: 'Lab' },

    // ==================== Mechatronics - SEMESTER 6 ====================
    { courseCode: 'MC611', courseName: 'Robotics', credits: 4, semester: 6, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MC612', courseName: 'Computer Integrated Manufacturing (CIM)', credits: 3, semester: 6, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MC613', courseName: 'Power Electronics and Electrical Drives', credits: 4, semester: 6, branches: ['MECH'], courseType: 'Theory' },
    { courseCode: 'MC614', courseName: 'Industrial Automation Lab', credits: 1, semester: 6, branches: ['MECH'], courseType: 'Lab' },
    { courseCode: 'MC615', courseName: 'Robotics Lab', credits: 1, semester: 6, branches: ['MECH'], courseType: 'Lab' },
    { courseCode: 'MC616', courseName: 'Drives Lab', credits: 1, semester: 6, branches: ['MECH'], courseType: 'Lab' }
];

async function seedSemester3to6Courses() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode');
        console.log('✅ Connected to MongoDB');

        // Delete only semester 3-6 courses to avoid deleting 1-2 sem data
        const deleteResult = await SemesterCourse.deleteMany({ semester: { $gte: 3, $lte: 6 } });
        console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing semester 3-6 courses`);

        // Insert new courses
        const insertedCourses = await SemesterCourse.insertMany(semester3to6Courses);
        console.log(`\n✅ Successfully seeded ${insertedCourses.length} courses (Semesters 3-6)!`);

        // Print summary
        console.log('\n📚 Branch-wise Course Summary (Sem 3-6):');
        console.log('━'.repeat(80));

        const branches = ['CSE', 'ECE-EC', 'ECE', 'VLSI', 'RAI', 'ME', 'MECH'];
        branches.forEach(branch => {
            const branchCourses = semester3to6Courses.filter(c => c.branches.includes(branch));
            const totalCredits = branchCourses.reduce((sum, c) => sum + c.credits, 0);

            console.log(`\n${branch}:`);
            for (let sem = 3; sem <= 6; sem++) {
                const semCourses = branchCourses.filter(c => c.semester === sem);
                const semCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);
                console.log(`  Sem ${sem}: ${semCourses.length} courses (${semCredits} credits)`);
            }
            console.log(`  Total: ${branchCourses.length} courses (${totalCredits} total credits)`);
        });

        console.log('\n' + '━'.repeat(80));
        console.log(`🎯 Grand Total: ${semester3to6Courses.length} courses added`);
        console.log('━'.repeat(80));

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding courses:', error);
        process.exit(1);
    }
}

seedSemester3to6Courses();
