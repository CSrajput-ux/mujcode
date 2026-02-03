// File: src/scripts/seedCourses.js
const mongoose = require('mongoose');
const Course = require('../models/mongo/Course');

const courses = [
    // C Programming (3 courses)
    {
        title: 'C Programming Fundamentals',
        description: 'Master the basics of C programming including variables, loops, functions, and pointers.',
        category: 'C',
        difficulty: 'Easy',
        totalProblems: 150,
        icon: 'code'
    },
    {
        title: 'Advanced C Programming',
        description: 'Deep dive into advanced C concepts like memory management, file handling, and data structures.',
        category: 'C',
        difficulty: 'Hard',
        totalProblems: 130,
        icon: 'code'
    },
    {
        title: 'C System Programming',
        description: 'Learn system-level programming in C - processes, threads, sockets, and IPC.',
        category: 'C',
        difficulty: 'Hard',
        totalProblems: 120,
        icon: 'code'
    },

    // Python (3 courses)
    {
        title: 'Python Fundamentals',
        description: 'Start your Python journey with lists, dictionaries, functions, and OOP concepts.',
        category: 'Python',
        difficulty: 'Easy',
        totalProblems: 140,
        icon: 'code'
    },
    {
        title: 'Python for Data Science',
        description: 'Learn Python with focus on NumPy, Pandas, and data analysis techniques.',
        category: 'Python',
        difficulty: 'Medium',
        totalProblems: 150,
        icon: 'code'
    },
    {
        title: 'Advanced Python Programming',
        description: 'Master decorators, generators, context managers, and async programming in Python.',
        category: 'Python',
        difficulty: 'Hard',
        totalProblems: 125,
        icon: 'code'
    },

    // Data Structures & Algorithms (3 courses)
    {
        title: 'DSA for Beginners',
        description: 'Introduction to basic data structures - arrays, stacks, queues, and linked lists.',
        category: 'DSA',
        difficulty: 'Easy',
        totalProblems: 120,
        icon: 'code'
    },
    {
        title: 'Data Structures & Algorithms',
        description: 'Complete DSA course covering arrays, linked lists, trees, graphs, and sorting algorithms.',
        category: 'DSA',
        difficulty: 'Hard',
        totalProblems: 250,
        icon: 'code'
    },
    {
        title: 'Advanced Algorithms',
        description: 'Master dynamic programming, greedy algorithms, backtracking, and graph algorithms.',
        category: 'DSA',
        difficulty: 'Hard',
        totalProblems: 180,
        icon: 'code'
    },

    // Java (2 courses)
    {
        title: 'Java Fundamentals',
        description: 'Learn Java basics - syntax, control structures, arrays, and strings.',
        category: 'Java',
        difficulty: 'Easy',
        totalProblems: 130,
        icon: 'code'
    },
    {
        title: 'Java Object-Oriented Programming',
        description: 'Master OOP concepts in Java including inheritance, polymorphism, and encapsulation.',
        category: 'Java',
        difficulty: 'Medium',
        totalProblems: 145,
        icon: 'code'
    },

    // SQL (2 courses)
    {
        title: 'SQL Fundamentals',
        description: 'Learn SQL basics - SELECT, INSERT, UPDATE, DELETE, and basic joins.',
        category: 'SQL',
        difficulty: 'Easy',
        totalProblems: 120,
        icon: 'database'
    },
    {
        title: 'Database Management Systems',
        description: 'Advanced SQL, normalization, transactions, indexing, and database design principles.',
        category: 'SQL',
        difficulty: 'Medium',
        totalProblems: 135,
        icon: 'database'
    },

    // JavaScript (3 courses)
    {
        title: 'JavaScript Essentials',
        description: 'Master JavaScript fundamentals - variables, functions, arrays, and objects.',
        category: 'JavaScript',
        difficulty: 'Easy',
        totalProblems: 140,
        icon: 'globe'
    },
    {
        title: 'Web Development with JavaScript',
        description: 'Build modern web applications with JavaScript, DOM manipulation, and async programming.',
        category: 'JavaScript',
        difficulty: 'Medium',
        totalProblems: 160,
        icon: 'globe'
    },
    {
        title: 'Advanced JavaScript & React',
        description: 'Master ES6+, React hooks, state management, and component architecture.',
        category: 'JavaScript',
        difficulty: 'Hard',
        totalProblems: 150,
        icon: 'globe'
    },

    // Interview Preparation (2 courses)
    {
        title: 'Coding Interview Preparation',
        description: 'Crack coding interviews with essential algorithms and problem-solving patterns.',
        category: 'Interview',
        difficulty: 'Medium',
        totalProblems: 200,
        icon: 'target'
    },
    {
        title: 'System Design & Advanced Interview',
        description: 'Master system design, behavioral questions, and advanced coding problems.',
        category: 'Interview',
        difficulty: 'Hard',
        totalProblems: 150,
        icon: 'target'
    },

    // C++ (2 courses)
    {
        title: 'C++ Fundamentals',
        description: 'Learn C++ basics - syntax, OOP, and standard library.',
        category: 'C++',
        difficulty: 'Easy',
        totalProblems: 130,
        icon: 'code'
    },
    {
        title: 'Advanced C++ & STL',
        description: 'Master C++ with STL containers, algorithms, templates, and modern C++ features.',
        category: 'C++',
        difficulty: 'Hard',
        totalProblems: 140,
        icon: 'code'
    }
];

async function seedCourses() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode');
        console.log('Connected to MongoDB');

        // Clear existing courses
        await Course.deleteMany({});
        console.log('Cleared existing courses');

        // Insert new courses
        await Course.insertMany(courses);
        console.log(`✅ Seeded ${courses.length} courses successfully!`);

        // Print summary
        const categories = {};
        courses.forEach(c => {
            categories[c.category] = (categories[c.category] || 0) + 1;
        });

        console.log('\n📚 Category-wise breakdown:');
        Object.entries(categories).forEach(([cat, count]) => {
            const coursesInCat = courses.filter(c => c.category === cat);
            const totalProblems = coursesInCat.reduce((sum, c) => sum + c.totalProblems, 0);
            console.log(`  ${cat}: ${count} courses (${totalProblems} total problems)`);
        });

        const totalProblems = courses.reduce((sum, c) => sum + c.totalProblems, 0);
        console.log(`\n🎯 Total: ${courses.length} courses with ${totalProblems} problems`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding courses:', error);
        process.exit(1);
    }
}

seedCourses();
