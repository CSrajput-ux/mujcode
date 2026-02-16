<<<<<<< HEAD
// Real Data extracted from https://jaipur.manipal.edu/
// Focus: All Main Schools (Faculties) and Departments

const MUJ_REAL_DATA = {
    faculties: [
        {
            name: "School of Engineering & Technology",
            acronym: "SET",
            departments: [
                {
                    name: "Department of Chemical Engineering",
                    code: "CHEM_ENG",
                    programs: [] // Add programs if needed
                },
                {
                    name: "Department of Civil Engineering",
                    code: "CIVIL",
                    programs: [
                        {
                            name: "B.Tech Civil Engineering",
                            duration: 4,
                            branches: [{ name: "Civil Engineering", code: "CIVIL", curriculum: {} }]
                        }
                    ]
                },
                {
                    name: "Department of Mechanical Engineering",
                    code: "MECH",
                    programs: [
                        {
                            name: "B.Tech Mechanical Engineering",
                            duration: 4,
                            branches: [{ name: "Mechanical Engineering", code: "MECH", curriculum: {} }]
                        }
                    ]
                },
                {
                    name: "Department of Mechatronics Engineering",
                    code: "MTE",
                    programs: [
                        {
                            name: "B.Tech Mechatronics Engineering",
                            duration: 4,
                            branches: [{ name: "Mechatronics Engineering", code: "MTE", curriculum: {} }]
                        }
                    ]
                },
                {
                    name: "Department of Automobile Engineering",
                    code: "AUTO",
                    programs: []
                },
                {
                    name: "Department of Electrical Engineering",
                    code: "EE",
                    programs: [
                        {
                            name: "B.Tech Electrical & Electronics Engineering",
                            duration: 4,
                            branches: [{ name: "Electrical & Electronics Engineering", code: "EEE", curriculum: {} }]
                        },
                        {
                            name: "B.Tech Electrical & Computer Engineering",
                            duration: 4,
                            branches: [{ name: "Electrical & Computer Engineering", code: "ELCE", curriculum: {} }]
                        }
                    ]
                },
                {
                    name: "Department of Electronics & Communication Engineering",
                    code: "ECE",
                    programs: [
                        {
                            name: "B.Tech Electronics & Communication Engineering",
                            duration: 4,
                            branches: [{ name: "Electronics & Communication Engineering", code: "ECE", curriculum: {} }]
                        }
                    ]
                }
            ]
        },
        {
            name: "School of Computer Science & Engineering",
            acronym: "SCSE",
            departments: [
                {
                    name: "Department of Computer Science & Engineering",
                    code: "CSE",
                    programs: [
                        {
                            name: "B.Tech Computer Science & Engineering",
                            duration: 4,
                            branches: [
                                {
                                    name: "Computer Science & Engineering",
                                    code: "CSE",
                                    curriculum: {
                                        1: ["Engineering Chemistry & Lab", "Calculus & Matrices", "Digital Systems", "Manufacturing Processes", "Problem-Solving Using Computers", "Universal Human Values", "Communication Skills", "Engineering Graphics"],
                                        2: ["Engineering Physics & Lab", "Computational Mathematics", "Environmental Studies", "Fundamentals of Data Structures", "Data Visualization", "Creativity & Innovation IDEA Lab", "Biology for Engineers", "Wellness and Community Services"],
                                        3: ["Probability and Statistics", "Principles of Management", "Data Structures and Algorithms", "Computer Organization and Architecture", "Relational Database Management Systems", "Object Oriented Programming"],
                                        4: ["Operating Systems", "Design and Analysis of Algorithms", "Computer Networks", "Artificial Intelligence", "Technical Report Writing"],
                                        5: ["Cloud Computing", "Data Science and Machine Learning", "Information System Security", "Software Engineering"],
                                        6: ["Theory of Computation", "Engineering Economics", "Machine Learning"],
                                        7: ["Major Project Phase 1", "Industrial Training"],
                                        8: ["Capstone Project"]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "Department of Information Technology",
                    code: "IT",
                    programs: [
                        {
                            name: "B.Tech Information Technology",
                            duration: 4,
                            branches: [
                                {
                                    name: "Information Technology",
                                    code: "IT",
                                    curriculum: {
                                        1: ["Engineering Chemistry & Lab", "Calculus & Matrices", "Digital Systems", "Manufacturing Processes", "Problem-Solving Using Computers", "Universal Human Values"],
                                        2: ["Engineering Physics & Lab", "Computational Mathematics", "Environmental Studies", "Fundamentals of Data Structures", "Data Visualization"],
                                        3: ["Data Structures & Algorithms", "Object Oriented Programming", "Digital Electronics", "Computer Organization"],
                                        4: ["Operating Systems", "Database Management Systems", "Computer Networks", "Software Engineering"],
                                        5: ["Web Technologies", "Information Security", "Data Mining"],
                                        6: ["Cloud Computing", "IoT"],
                                        7: ["Project Phase 1"],
                                        8: ["Project Phase 2"]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "Department of Computer and Communication Engineering",
                    code: "CCE",
                    programs: [{ name: "B.Tech CCE", duration: 4, branches: [{ name: "Computer & Communication Engineering", code: "CCE", curriculum: {} }] }]
                },
                {
                    name: "Department of Data Science & Engineering",
                    code: "DSE",
                    programs: [{ name: "B.Tech Data Science", duration: 4, branches: [{ name: "Data Science & Engineering", code: "DSE", curriculum: {} }] }]
                },
                {
                    name: "Department of Artificial Intelligence & Machine Learning",
                    code: "AIML",
                    programs: [{ name: "B.Tech AI & ML", duration: 4, branches: [{ name: "AI & Machine Learning", code: "AIML", curriculum: {} }] }]
                },
                {
                    name: "Department of Computer Applications",
                    code: "CA",
                    programs: [
                        { name: "BCA", duration: 3, branches: [{ name: "Bachelor of Computer Applications", code: "BCA", curriculum: {} }] },
                        { name: "MCA", duration: 2, branches: [{ name: "Master of Computer Applications", code: "MCA", curriculum: {} }] }
                    ]
                }
            ]
        },
        {
            name: "School of Business & Commerce",
            acronym: "SBC",
            departments: [
                {
                    name: "Department of Commerce",
                    code: "COMMERCE",
                    programs: [{ name: "B.Com", duration: 3, branches: [{ name: "Bachelor of Commerce", code: "BCOM", curriculum: {} }] }]
                },
                {
                    name: "Department of Business Administration",
                    code: "BBA",
                    programs: [{ name: "BBA", duration: 3, branches: [{ name: "Bachelor of Business Administration", code: "BBA", curriculum: {} }] }]
                }
                // Add Management if separate or part of Business Admin
            ]
        },
        {
            name: "School of Law",
            acronym: "SOL",
            departments: [
                {
                    name: "Department of Law",
                    code: "LAW",
                    programs: [
                        { name: "BA LLB (Hons)", duration: 5, branches: [{ name: "BA LLB", code: "BALLB", curriculum: {} }] },
                        { name: "BBA LLB (Hons)", duration: 5, branches: [{ name: "BBA LLB", code: "BBALLB", curriculum: {} }] },
                        { name: "LLB", duration: 3, branches: [{ name: "Bachelor of Laws", code: "LLB", curriculum: {} }] },
                        { name: "LLM", duration: 1, branches: [{ name: "Master of Laws", code: "LLM", curriculum: {} }] }
                    ]
                }
            ]
        },
        {
            name: "School of Architecture & Design",
            acronym: "SA&D",
            departments: [
                {
                    name: "Department of Architecture",
                    code: "ARCH",
                    programs: [
                        { name: "B.Arch", duration: 5, branches: [{ name: "Bachelor of Architecture", code: "BARCH", curriculum: {} }] }
                    ]
                },
                {
                    name: "Department of Design",
                    code: "DESIGN",
                    programs: [
                        { name: "B.Des", duration: 4, branches: [{ name: "Bachelor of Design", code: "BDES", curriculum: {} }] }
                    ]
                }
            ]
        },
        {
            name: "School of Basic Sciences & Humanities",
            acronym: "SBS&H",
            departments: [
                {
                    name: "Department of Physics",
                    code: "PHYSICS",
                    programs: [{ name: "B.Sc Physics", duration: 3, branches: [{ name: "B.Sc Physics", code: "BSC_PHY", curriculum: {} }] }]
                },
                {
                    name: "Department of Chemistry",
                    code: "CHEMISTRY",
                    programs: [{ name: "B.Sc Chemistry", duration: 3, branches: [{ name: "B.Sc Chemistry", code: "BSC_CHEM", curriculum: {} }] }]
                },
                {
                    name: "Department of Mathematics & Statistics",
                    code: "MATH",
                    programs: [{ name: "B.Sc Mathematics", duration: 3, branches: [{ name: "B.Sc Mathematics", code: "BSC_MATH", curriculum: {} }] }]
                },
                {
                    name: "Department of Languages (English & Humanities)",
                    code: "LANG",
                    programs: [{ name: "BA English", duration: 3, branches: [{ name: "BA English", code: "BA_ENG", curriculum: {} }] }]
                }
            ]
        }
    ]
};

module.exports = MUJ_REAL_DATA;
=======
// Real Data extracted from https://jaipur.manipal.edu/
// Focus: Faculty of Science, Technology and Architecture (FoSTA)

const MUJ_REAL_DATA = {
    faculties: [
        {
            name: "Faculty of Science, Technology and Architecture",
            acronym: "FoSTA",
            departments: [
                {
                    name: "Department of Computer Science & Engineering",
                    code: "CSE",
                    programs: [
                        {
                            name: "B.Tech Computer Science & Engineering",
                            duration: 4,
                            branches: [
                                {
                                    name: "Computer Science & Engineering",
                                    code: "CSE",
                                    curriculum: {
                                        1: ["Engineering Chemistry & Lab", "Calculus & Matrices", "Digital Systems", "Manufacturing Processes", "Problem-Solving Using Computers", "Universal Human Values", "Communication Skills", "Engineering Graphics"],
                                        2: ["Engineering Physics & Lab", "Computational Mathematics", "Environmental Studies", "Fundamentals of Data Structures", "Data Visualization", "Creativity & Innovation IDEA Lab", "Biology for Engineers", "Wellness and Community Services"],
                                        3: ["Probability and Statistics", "Principles of Management", "Data Structures and Algorithms", "Computer Organization and Architecture", "Relational Database Management Systems", "Object Oriented Programming"],
                                        4: ["Operating Systems", "Design and Analysis of Algorithms", "Computer Networks", "Artificial Intelligence", "Technical Report Writing"],
                                        5: ["Cloud Computing", "Data Science and Machine Learning", "Information System Security", "Software Engineering"],
                                        6: ["Theory of Computation", "Engineering Economics", "Machine Learning"],
                                        7: ["Major Project Phase 1", "Industrial Training"],
                                        8: ["Capstone Project"]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "Department of Information Technology",
                    code: "IT",
                    programs: [
                        {
                            name: "B.Tech Information Technology",
                            duration: 4,
                            branches: [
                                {
                                    name: "Information Technology",
                                    code: "IT",
                                    // Assuming common first year
                                    curriculum: {
                                        1: ["Engineering Chemistry & Lab", "Calculus & Matrices", "Digital Systems", "Manufacturing Processes", "Problem-Solving Using Computers", "Universal Human Values"],
                                        2: ["Engineering Physics & Lab", "Computational Mathematics", "Environmental Studies", "Fundamentals of Data Structures", "Data Visualization"],
                                        3: ["Data Structures & Algorithms", "Object Oriented Programming", "Digital Electronics", "Computer Organization"],
                                        4: ["Operating Systems", "Database Management Systems", "Computer Networks", "Software Engineering"],
                                        5: ["Web Technologies", "Information Security", "Data Mining"],
                                        6: ["Cloud Computing", "IoT"],
                                        7: ["Project Phase 1"],
                                        8: ["Project Phase 2"]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "Department of Computer and Communication Engineering",
                    code: "CCE",
                    programs: [{ name: "B.Tech CCE", duration: 4, branches: [{ name: "Computer & Communication Engineering", code: "CCE", curriculum: {} }] }]
                },
                {
                    name: "Department of Data Science & Engineering",
                    code: "DSE",
                    programs: [{ name: "B.Tech Data Science", duration: 4, branches: [{ name: "Data Science & Engineering", code: "DSE", curriculum: {} }] }]
                },
                {
                    name: "Department of Artificial Intelligence & Machine Learning",
                    code: "AIML",
                    programs: [{ name: "B.Tech AI & ML", duration: 4, branches: [{ name: "AI & Machine Learning", code: "AIML", curriculum: {} }] }]
                }
            ]
        }
    ]
};

module.exports = MUJ_REAL_DATA;
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
