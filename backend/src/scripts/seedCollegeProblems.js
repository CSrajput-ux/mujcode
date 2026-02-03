// File: src/scripts/seedCollegeProblems.js
const mongoose = require('mongoose');
const Problem = require('../models/mongo/Problem');

const collegeProblems = [
    // ============ 1ST YEAR - C PROGRAMMING ============
    {
        number: 101,
        title: 'Sum of Two Numbers',
        description: 'Write a C program to add two integers and display the result.',
        difficulty: 'Easy',
        category: 'C Programming',
        topic: 'Variables & Data Types',
        acceptanceRate: 85.5,
        totalSubmissions: 12000,
        acceptedSubmissions: 10260
    },
    {
        number: 102,
        title: 'Check Even or Odd',
        description: 'Write a C program to check whether a number is even or odd using if-else.',
        difficulty: 'Easy',
        category: 'C Programming',
        topic: 'Control Flow',
        acceptanceRate: 82.3,
        totalSubmissions: 11500,
        acceptedSubmissions: 9465
    },
    {
        number: 103,
        title: 'Print Fibonacci Series',
        description: 'Write a C program to print Fibonacci series up to n terms using loops.',
        difficulty: 'Easy',
        category: 'C Programming',
        topic: 'Loops',
        acceptanceRate: 68.7,
        totalSubmissions: 9800,
        acceptedSubmissions: 6733
    },
    {
        number: 104,
        title: 'Find Largest of Three Numbers',
        description: 'Write a C program to find the largest of three numbers using if-else statements.',
        difficulty: 'Easy',
        category: 'C Programming',
        topic: 'Control Flow',
        acceptanceRate: 78.2,
        totalSubmissions: 10200,
        acceptedSubmissions: 7976
    },
    {
        number: 105,
        title: 'Factorial Using Recursion',
        description: 'Write a C program to calculate factorial of a number using recursive function.',
        difficulty: 'Medium',
        category: 'C Programming',
        topic: 'Functions',
        acceptanceRate: 64.5,
        totalSubmissions: 8900,
        acceptedSubmissions: 5741
    },
    {
        number: 106,
        title: 'Reverse an Array',
        description: 'Write a C program to reverse an array using pointers.',
        difficulty: 'Medium',
        category: 'C Programming',
        topic: 'Arrays & Pointers',
        acceptanceRate: 58.9,
        totalSubmissions: 7600,
        acceptedSubmissions: 4476
    },
    {
        number: 107,
        title: 'String Palindrome Check',
        description: 'Write a C program to check if a string is palindrome using string functions.',
        difficulty: 'Medium',
        category: 'C Programming',
        topic: 'Strings',
        acceptanceRate: 55.3,
        totalSubmissions: 8200,
        acceptedSubmissions: 4535
    },
    {
        number: 108,
        title: 'Matrix Multiplication',
        description: 'Write a C program to multiply two matrices using 2D arrays.',
        difficulty: 'Medium',
        category: 'C Programming',
        topic: '2D Arrays',
        acceptanceRate: 48.7,
        totalSubmissions: 6500,
        acceptedSubmissions: 3166
    },
    {
        number: 109,
        title: 'Student Record System',
        description: 'Create a structure to store student records (name, roll, marks) and display them.',
        difficulty: 'Medium',
        category: 'C Programming',
        topic: 'Structures',
        acceptanceRate: 62.4,
        totalSubmissions: 5800,
        acceptedSubmissions: 3619
    },

    // ============ 1ST YEAR - PYTHON ============
    {
        number: 201,
        title: 'List Operations',
        description: 'Perform insertion, deletion, and sorting operations on a Python list.',
        difficulty: 'Easy',
        category: 'Python',
        topic: 'Lists',
        acceptanceRate: 76.8,
        totalSubmissions: 9400,
        acceptedSubmissions: 7219
    },
    {
        number: 202,
        title: 'Dictionary Manipulation',
        description: 'Create a dictionary to store student names and marks, then find the highest scorer.',
        difficulty: 'Easy',
        category: 'Python',
        topic: 'Dictionaries',
        acceptanceRate: 72.1,
        totalSubmissions: 8700,
        acceptedSubmissions: 6273
    },
    {
        number: 203,
        title: 'File Read and Write',
        description: 'Read data from a text file and write the word count to another file.',
        difficulty: 'Medium',
        category: 'Python',
        topic: 'File Handling',
        acceptanceRate: 64.3,
        totalSubmissions: 7200,
        acceptedSubmissions: 4630
    },
    {
        number: 204,
        title: 'Exception Handling Demo',
        description: 'Write a program that handles division by zero using try-except blocks.',
        difficulty: 'Easy',
        category: 'Python',
        topic: 'Exception Handling',
        acceptanceRate: 81.2,
        totalSubmissions: 6900,
        acceptedSubmissions: 5603
    },
    {
        number: 205,
        title: 'NumPy Array Operations',
        description: 'Create NumPy arrays and perform element-wise operations and matrix operations.',
        difficulty: 'Medium',
        category: 'Python',
        topic: 'NumPy',
        acceptanceRate: 59.7,
        totalSubmissions: 5600,
        acceptedSubmissions: 3343
    },

    // ============ 2ND YEAR - OOPs ============
    {
        number: 301,
        title: 'Create a Class for Rectangle',
        description: 'Create a Rectangle class with methods to calculate area and perimeter.',
        difficulty: 'Easy',
        category: 'OOPs',
        topic: 'Classes & Objects',
        acceptanceRate: 74.5,
        totalSubmissions: 11200,
        acceptedSubmissions: 8344
    },
    {
        number: 302,
        title: 'Inheritance - Vehicle Hierarchy',
        description: 'Create a Vehicle parent class and Car, Bike child classes demonstrating inheritance.',
        difficulty: 'Medium',
        category: 'OOPs',
        topic: 'Inheritance',
        acceptanceRate: 66.3,
        totalSubmissions: 9800,
        acceptedSubmissions: 6497
    },
    {
        number: 303,
        title: 'Method Overloading',
        description: 'Demonstrate method overloading by creating multiple add() methods with different parameters.',
        difficulty: 'Medium',
        category: 'OOPs',
        topic: 'Polymorphism',
        acceptanceRate: 58.9,
        totalSubmissions: 8400,
        acceptedSubmissions: 4948
    },
    {
        number: 304,
        title: 'Encapsulation - Bank Account',
        description: 'Create a BankAccount class with private balance and public deposit/withdraw methods.',
        difficulty: 'Medium',
        category: 'OOPs',
        topic: 'Encapsulation',
        acceptanceRate: 61.7,
        totalSubmissions: 7900,
        acceptedSubmissions: 4874
    },

    // ============ 2ND YEAR - DSA ============
    {
        number: 401,
        title: 'Implement Stack using Array',
        description: 'Implement stack data structure with push, pop, and display operations.',
        difficulty: 'Easy',
        category: 'Data Structures',
        topic: 'Stack',
        acceptanceRate: 69.4,
        totalSubmissions: 13500,
        acceptedSubmissions: 9369
    },
    {
        number: 402,
        title: 'Queue Implementation',
        description: 'Implement queue using linked list with enqueue and dequeue operations.',
        difficulty: 'Easy',
        category: 'Data Structures',
        topic: 'Queue',
        acceptanceRate: 65.8,
        totalSubmissions: 12800,
        acceptedSubmissions: 8422
    },
    {
        number: 403,
        title: 'Singly Linked List Operations',
        description: 'Implement singly linked list with insert, delete, and reverse operations.',
        difficulty: 'Medium',
        category: 'Data Structures',
        topic: 'Linked List',
        acceptanceRate: 54.2,
        totalSubmissions: 11700,
        acceptedSubmissions: 6341
    },
    {
        number: 404,
        title: 'Binary Search Tree Insert',
        description: 'Implement insertion operation in Binary Search Tree.',
        difficulty: 'Medium',
        category: 'Data Structures',
        topic: 'Trees',
        acceptanceRate: 48.9,
        totalSubmissions: 9600,
        acceptedSubmissions: 4694
    },
    {
        number: 405,
        title: 'Bubble Sort Implementation',
        description: 'Implement bubble sort algorithm and analyze time complexity.',
        difficulty: 'Easy',
        category: 'Algorithms',
        topic: 'Sorting',
        acceptanceRate: 78.3,
        totalSubmissions: 14200,
        acceptedSubmissions: 11119
    },
    {
        number: 406,
        title: 'Merge Sort',
        description: 'Implement merge sort algorithm using divide and conquer approach.',
        difficulty: 'Medium',
        category: 'Algorithms',
        topic: 'Sorting',
        acceptanceRate: 52.7,
        totalSubmissions: 8900,
        acceptedSubmissions: 4690
    },
    {
        number: 407,
        title: 'Binary Search',
        description: 'Implement binary search algorithm on sorted array.',
        difficulty: 'Easy',
        category: 'Algorithms',
        topic: 'Searching',
        acceptanceRate: 71.5,
        totalSubmissions: 15600,
        acceptedSubmissions: 11154
    },
    {
        number: 408,
        title: 'Graph BFS Traversal',
        description: 'Implement Breadth First Search (BFS) traversal for a graph.',
        difficulty: 'Medium',
        category: 'Data Structures',
        topic: 'Graph',
        acceptanceRate: 46.8,
        totalSubmissions: 7800,
        acceptedSubmissions: 3650
    },
    {
        number: 409,
        title: 'HashMap Implementation',
        description: 'Implement HashMap data structure with put, get, and remove operations.',
        difficulty: 'Hard',
        category: 'Data Structures',
        topic: 'Hashing',
        acceptanceRate: 38.2,
        totalSubmissions: 5600,
        acceptedSubmissions: 2139
    },

    // ============ 3RD YEAR - DBMS ============
    {
        number: 501,
        title: 'Create Employee Table',
        description: 'Write SQL query to create an Employee table with appropriate constraints.',
        difficulty: 'Easy',
        category: 'Database',
        topic: 'DDL Commands',
        acceptanceRate: 82.6,
        totalSubmissions: 10500,
        acceptedSubmissions: 8673
    },
    {
        number: 502,
        title: 'Insert and Update Records',
        description: 'Write SQL queries to insert records into a table and update salary of employees.',
        difficulty: 'Easy',
        category: 'Database',
        topic: 'DML Commands',
        acceptanceRate: 79.3,
        totalSubmissions: 9800,
        acceptedSubmissions: 7771
    },
    {
        number: 503,
        title: 'Inner Join Query',
        description: 'Write SQL query to join Employee and Department tables using INNER JOIN.',
        difficulty: 'Medium',
        category: 'Database',
        topic: 'SQL Joins',
        acceptanceRate: 58.4,
        totalSubmissions: 8700,
        acceptedSubmissions: 5081
    },
    {
        number: 504,
        title: 'Database Normalization',
        description: 'Normalize a given table to 3NF (Third Normal Form).',
        difficulty: 'Medium',
        category: 'Database',
        topic: 'Normalization',
        acceptanceRate: 45.7,
        totalSubmissions: 6400,
        acceptedSubmissions: 2925
    },
    {
        number: 505,
        title: 'Transaction Management',
        description: 'Demonstrate ACID properties using SQL transactions (BEGIN, COMMIT, ROLLBACK).',
        difficulty: 'Medium',
        category: 'Database',
        topic: 'Transactions',
        acceptanceRate: 52.3,
        totalSubmissions: 5900,
        acceptedSubmissions: 3086
    },
    {
        number: 506,
        title: 'MongoDB CRUD Operations',
        description: 'Perform Create, Read, Update, Delete operations in MongoDB.',
        difficulty: 'Easy',
        category: 'Database',
        topic: 'NoSQL',
        acceptanceRate: 68.9,
        totalSubmissions: 7200,
        acceptedSubmissions: 4961
    },

    // ============ 3RD YEAR - WEB TECHNOLOGIES ============
    {
        number: 601,
        title: 'Create Responsive Navbar',
        description: 'Create a responsive navigation bar using HTML5 and CSS3 Flexbox.',
        difficulty: 'Easy',
        category: 'Web Development',
        topic: 'HTML & CSS',
        acceptanceRate: 75.8,
        totalSubmissions: 11300,
        acceptedSubmissions: 8565
    },
    {
        number: 602,
        title: 'DOM Manipulation',
        description: 'Write JavaScript to dynamically add/remove elements from the DOM.',
        difficulty: 'Medium',
        category: 'Web Development',
        topic: 'JavaScript',
        acceptanceRate: 63.2,
        totalSubmissions: 9500,
        acceptedSubmissions: 6004
    },
    {
        number: 603,
        title: 'Fetch API Call',
        description: 'Use Fetch API to get data from a REST API and display it on the page.',
        difficulty: 'Medium',
        category: 'Web Development',
        topic: 'Async JavaScript',
        acceptanceRate: 56.7,
        totalSubmissions: 8200,
        acceptedSubmissions: 4649
    },
    {
        number: 604,
        title: 'React Counter Component',
        description: 'Create a counter component in React using useState hook.',
        difficulty: 'Easy',
        category: 'Web Development',
        topic: 'React.js',
        acceptanceRate: 71.4,
        totalSubmissions: 10800,
        acceptedSubmissions: 7711
    },
    {
        number: 605,
        title: 'Express.js REST API',
        description: 'Create a simple REST API using Express.js with GET and POST endpoints.',
        difficulty: 'Medium',
        category: 'Web Development',
        topic: 'Node.js',
        acceptanceRate: 54.9,
        totalSubmissions: 7600,
        acceptedSubmissions: 4172
    },
    {
        number: 606,
        title: 'JWT Authentication',
        description: 'Implement JWT-based authentication in a Node.js application.',
        difficulty: 'Hard',
        category: 'Web Development',
        topic: 'Authentication',
        acceptanceRate: 42.6,
        totalSubmissions: 5400,
        acceptedSubmissions: 2300
    },

    // ============ 3RD YEAR - OPERATING SYSTEMS ============
    {
        number: 701,
        title: 'CPU Scheduling - FCFS',
        description: 'Implement First Come First Serve (FCFS) CPU scheduling algorithm.',
        difficulty: 'Medium',
        category: 'Operating Systems',
        topic: 'CPU Scheduling',
        acceptanceRate: 61.8,
        totalSubmissions: 8900,
        acceptedSubmissions: 5500
    },
    {
        number: 702,
        title: 'Process Creation using fork()',
        description: 'Write a C program to create child process using fork() system call.',
        difficulty: 'Medium',
        category: 'Operating Systems',
        topic: 'Process Management',
        acceptanceRate: 55.2,
        totalSubmissions: 7400,
        acceptedSubmissions: 4085
    },
    {
        number: 703,
        title: 'Multithreading in C',
        description: 'Create multiple threads using pthread library and demonstrate synchronization.',
        difficulty: 'Hard',
        category: 'Operating Systems',
        topic: 'Threads',
        acceptanceRate: 43.7,
        totalSubmissions: 5800,
        acceptedSubmissions: 2535
    },
    {
        number: 704,
        title: 'Memory Allocation Simulation',
        description: 'Simulate First Fit, Best Fit, and Worst Fit memory allocation algorithms.',
        difficulty: 'Medium',
        category: 'Operating Systems',
        topic: 'Memory Management',
        acceptanceRate: 49.3,
        totalSubmissions: 6700,
        acceptedSubmissions: 3303
    },
    {
        number: 705,
        title: 'Linux Shell Commands',
        description: 'Write a bash script to perform file operations (create, copy, move, delete).',
        difficulty: 'Easy',
        category: 'Operating Systems',
        topic: 'Shell Scripting',
        acceptanceRate: 67.9,
        totalSubmissions: 9200,
        acceptedSubmissions: 6247
    },

    // ============ 4TH YEAR - COMPUTER NETWORKS ============
    {
        number: 801,
        title: 'Calculate IP Address Class',
        description: 'Write a program to determine the class of an IP address (A, B, C, D, E).',
        difficulty: 'Easy',
        category: 'Computer Networks',
        topic: 'IP Addressing',
        acceptanceRate: 73.5,
        totalSubmissions: 8600,
        acceptedSubmissions: 6321
    },
    {
        number: 802,
        title: 'Subnetting Problem',
        description: 'Given an IP address and subnet mask, calculate network and broadcast addresses.',
        difficulty: 'Medium',
        category: 'Computer Networks',
        topic: 'Subnetting',
        acceptanceRate: 48.2,
        totalSubmissions: 6200,
        acceptedSubmissions: 2988
    },
    {
        number: 803,
        title: 'HTTP vs HTTPS',
        description: 'Explain the difference between HTTP and HTTPS protocols with examples.',
        difficulty: 'Easy',
        category: 'Computer Networks',
        topic: 'Protocols',
        acceptanceRate: 81.3,
        totalSubmissions: 7800,
        acceptedSubmissions: 6341
    },
    {
        number: 804,
        title: 'TCP Socket Programming',
        description: 'Implement a simple TCP client-server application in C or Python.',
        difficulty: 'Hard',
        category: 'Computer Networks',
        topic: 'TCP/UDP',
        acceptanceRate: 39.8,
        totalSubmissions: 5100,
        acceptedSubmissions: 2030
    },

    // ============ 4TH YEAR - CLOUD & DEVOPS ============
    {
        number: 901,
        title: 'Deploy Node.js App on AWS',
        description: 'Deploy a simple Node.js application on AWS EC2 instance.',
        difficulty: 'Medium',
        category: 'Cloud Computing',
        topic: 'AWS',
        acceptanceRate: 52.7,
        totalSubmissions: 4600,
        acceptedSubmissions: 2424
    },
    {
        number: 902,
        title: 'Create Dockerfile',
        description: 'Write a Dockerfile to containerize a Python Flask application.',
        difficulty: 'Medium',
        category: 'DevOps',
        topic: 'Docker',
        acceptanceRate: 58.4,
        totalSubmissions: 6800,
        acceptedSubmissions: 3971
    },
    {
        number: 903,
        title: 'Kubernetes Pod Deployment',
        description: 'Create a Kubernetes deployment configuration for a web application.',
        difficulty: 'Hard',
        category: 'DevOps',
        topic: 'Kubernetes',
        acceptanceRate: 41.2,
        totalSubmissions: 3900,
        acceptedSubmissions: 1607
    },
    {
        number: 904,
        title: 'CI/CD Pipeline Setup',
        description: 'Set up a basic CI/CD pipeline using GitHub Actions.',
        difficulty: 'Medium',
        category: 'DevOps',
        topic: 'CI/CD',
        acceptanceRate: 54.8,
        totalSubmissions: 5200,
        acceptedSubmissions: 2850
    }
];

async function seedCollegeProblems() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode');
        console.log('Connected to MongoDB');

        // Clear existing problems (optional)
        await Problem.deleteMany({});
        console.log('Cleared existing problems');

        // Insert new problems
        await Problem.insertMany(collegeProblems);
        console.log(`Seeded ${collegeProblems.length} college curriculum problems successfully!`);

        // Print summary
        const categories = {};
        collegeProblems.forEach(p => {
            categories[p.category] = (categories[p.category] || 0) + 1;
        });
        console.log('\nCategory-wise breakdown:');
        Object.entries(categories).forEach(([cat, count]) => {
            console.log(`  ${cat}: ${count} problems`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding problems:', error);
        process.exit(1);
    }
}

seedCollegeProblems();
