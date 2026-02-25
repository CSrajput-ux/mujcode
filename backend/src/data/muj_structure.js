// File: src/data/muj_structure.js

const MUJ_STRUCTURE = {
    programs: [
        "B.Tech", "BCA", "BBA", "B.Sc", "B.Com", "B.Arch", "B.Des", "BA", "LLB",
        "M.Tech", "MCA", "MBA", "M.Sc", "M.Com", "MA", "PhD"
    ],
    departments: [
        "Computer Science and Engineering (CSE)",
        "Information Technology (IT)",
        "Computer and Communication Engineering (CCE)",
        "Electronics and Communication Engineering (ECE)",
        "Electrical and Electronics Engineering (EEE)",
        "Mechanical Engineering (ME)",
        "Civil Engineering (CE)",
        "Automobile Engineering",
        "Mechatronics Engineering",
        "Chemical Engineering",
        "Data Science and Engineering",
        "Computer Applications",
        "Business Administration",
        "Commerce",
        "Hotel Management",
        "Journalism and Mass Communication",
        "Psychology",
        "Economics",
        "Mathematics and Statistics",
        "Physics",
        "Chemistry",
        "Biosciences",
        "Law",
        "Architecture",
        "Design",
        "Fashion Design",
        "Interior Design"
    ],
    // Mapping Departments to common abbreviations/branches
    branches: {
        "Computer Science and Engineering (CSE)": ["CSE", "CSE-AI", "CSE-DS", "CSE-IOT", "CSE-Cloud"],
        "Information Technology (IT)": ["IT"],
        "Computer and Communication Engineering (CCE)": ["CCE"],
        "Electronics and Communication Engineering (ECE)": ["ECE", "ECE-VLSI"],
        "Electrical and Electronics Engineering (EEE)": ["EEE"],
        "Mechanical Engineering (ME)": ["ME"],
        "Civil Engineering (CE)": ["CE"],
        "Computer Applications": ["BCA", "MCA"],
        "Business Administration": ["BBA", "MBA"],
        "Commerce": ["B.Com", "M.Com"]
    },
    sections: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"],
    years: [1, 2, 3, 4, 5], // 5 for Architecture/Law
    semesters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
};

module.exports = MUJ_STRUCTURE;
