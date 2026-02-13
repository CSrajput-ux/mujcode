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
