// Script to seed sample mock tests for testing
const { default: mongoose } = require('mongoose');
const MockTest = require('../models/mongo/MockTest');
const MockQuestion = require('../models/mongo/MockQuestion');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';

const sampleMockTests = [
    {
        title: "JavaScript Basics Mock Test",
        description: "Test your fundamental JavaScript knowledge with this comprehensive mock test covering variables, functions, and control flow.",
        difficulty: "Easy",
        duration: 15,
        totalQuestions: 10,
        questionsPerAttempt: 10,
        attemptsAllowed: -1,
        category: "Programming",
        passingPercentage: 60,
        questions: [
            {
                questionText: "What is the correct syntax for referring to an external script called 'script.js'?",
                options: [
                    "<script src='script.js'>",
                    "<script href='script.js'>",
                    "<script name='script.js'>",
                    "<script file='script.js'>"
                ],
                correctOption: 0,
                explanation: "The 'src' attribute is used to specify the URL of an external script file.",
                difficulty: "Easy",
                points: 5
            },
            {
                questionText: "Which company developed JavaScript?",
                options: ["Microsoft", "Netscape", "Sun Microsystems", "Oracle"],
                correctOption: 1,
                explanation: "JavaScript was originally developed by Brendan Eich at Netscape in 1995.",
                difficulty: "Easy",
                points: 5
            },
            {
                questionText: "What is the output of: typeof null",
                options: ["'null'", "'undefined'", "'object'", "'number'"],
                correctOption: 2,
                explanation: "This is a known quirk in JavaScript. typeof null returns 'object' due to a legacy bug.",
                difficulty: "Medium",
                points: 5
            },
            {
                questionText: "How do you declare a JavaScript variable?",
                options: ["v carName;", "var carName;", "variable carName;", "declare carName;"],
                correctOption: 1,
                explanation: "In JavaScript, variables are declared using var, let, or const keywords.",
                difficulty: "Easy",
                points: 5
            },
            {
                questionText: "Which operator is used to assign a value to a variable?",
                options: ["*", "=", "x", "-"],
                correctOption: 1,
                explanation: "The = operator is the assignment operator in JavaScript.",
                difficulty: "Easy",
                points: 5
            },
            {
                questionText: "What will be the output of: 2 + '2'",
                options: ["4", "22", "'22'", "Error"],
                correctOption: 2,
                explanation: "When adding a number and a string, JavaScript converts the number to a string, resulting in string concatenation.",
                difficulty: "Medium",
                points: 5
            },
            {
                questionText: "How do you create a function in JavaScript?",
                options: [
                    "function = myFunction()",
                    "function:myFunction()",
                    "function myFunction()",
                    "create myFunction()"
                ],
                correctOption: 2,
                explanation: "Functions in JavaScript are declared using the 'function' keyword followed by the name and parentheses.",
                difficulty: "Easy",
                points: 5
            },
            {
                questionText: "What is the correct way to write an IF statement in JavaScript?",
                options: [
                    "if i = 5 then",
                    "if (i == 5)",
                    "if i == 5",
                    "if i = 5"
                ],
                correctOption: 1,
                explanation: "JavaScript IF statements use parentheses around the condition.",
                difficulty: "Easy",
                points: 5
            },
            {
                questionText: "Which method is used to parse a string to an integer?",
                options: ["parseInt()", "parseInteger()", "int()", "parseToInt()"],
                correctOption: 0,
                explanation: "parseInt() is the built-in JavaScript function to convert strings to integers.",
                difficulty: "Easy",
                points: 5
            },
            {
                questionText: "What does === operator do?",
                options: [
                    "Checks value only",
                    "Checks type only",
                    "Checks both value and type",
                    "Assignment operator"
                ],
                correctOption: 2,
                explanation: "The === operator is the strict equality operator that checks both value and type.",
                difficulty: "Medium",
                points: 5
            }
        ]
    },
    {
        title: "Python Fundamentals Quiz",
        description: "Assess your Python programming skills with questions on syntax, data types, and basic operations.",
        difficulty: "Medium",
        duration: 20,
        totalQuestions: 8,
        questionsPerAttempt: 8,
        attemptsAllowed: 3,
        category: "Programming",
        passingPercentage: 70,
        questions: [
            {
                questionText: "What is the output of: print(type([]))",
                options: ["<class 'tuple'>", "<class 'list'>", "<class 'dict'>", "<class 'set'>"],
                correctOption: 1,
                explanation: "Empty square brackets [] create a list in Python.",
                difficulty: "Easy",
                points: 10
            },
            {
                questionText: "Which keyword is used to create a function in Python?",
                options: ["func", "define", "def", "function"],
                correctOption: 2,
                explanation: "The 'def' keyword is used to define functions in Python.",
                difficulty: "Easy",
                points: 10
            },
            {
                questionText: "What is the correct file extension for Python files?",
                options: [".python", ".pt", ".py", ".pyt"],
                correctOption: 2,
                explanation: "Python files use the .py extension.",
                difficulty: "Easy",
                points: 10
            },
            {
                questionText: "How do you insert COMMENTS in Python code?",
                options: ["//", "/*", "#", "<!--"],
                correctOption: 2,
                explanation: "Comments in Python start with the # symbol.",
                difficulty: "Easy",
                points: 10
            },
            {
                questionText: "What is the output of: len('Hello')",
                options: ["4", "5", "6", "Error"],
                correctOption: 1,
                explanation: "The len() function returns the number of characters in the string 'Hello', which is 5.",
                difficulty: "Easy",
                points: 10
            },
            {
                questionText: "Which of the following is a mutable data type in Python?",
                options: ["tuple", "string", "list", "int"],
                correctOption: 2,
                explanation: "Lists are mutable in Python, meaning their elements can be changed after creation.",
                difficulty: "Medium",
                points: 10
            },
            {
                questionText: "What does the 'break' statement do in Python?",
                options: [
                    "Exits the program",
                    "Exits the current loop",
                    "Skips to next iteration",
                    "Does nothing"
                ],
                correctOption: 1,
                explanation: "The 'break' statement terminates the loop and transfers execution to the statement immediately following the loop.",
                difficulty: "Medium",
                points: 10
            },
            {
                questionText: "What is the output of: print(3 ** 2)",
                options: ["6", "9", "5", "Error"],
                correctOption: 1,
                explanation: "The ** operator is the exponentiation operator in Python. 3 ** 2 equals 3 squared, which is 9.",
                difficulty: "Medium",
                points: 10
            }
        ]
    },
    {
        title: "DSA Quick Challenge",
        description: "Challenge yourself with Data Structures and Algorithms questions covering arrays, linked lists, and complexity.",
        difficulty: "Hard",
        duration: 30,
        totalQuestions: 12,
        questionsPerAttempt: 10,
        attemptsAllowed: 2,
        category: "DSA",
        passingPercentage: 50,
        questions: [
            {
                questionText: "What is the time complexity of binary search?",
                options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
                correctOption: 1,
                explanation: "Binary search has O(log n) time complexity as it halves the search space in each iteration.",
                difficulty: "Medium",
                points: 5
            },
            {
                questionText: "Which data structure uses LIFO (Last In First Out)?",
                options: ["Queue", "Stack", "Array", "Tree"],
                correctOption: 1,
                explanation: "Stack follows the LIFO principle where the last element added is the first one removed.",
                difficulty: "Easy",
                points: 5
            },
            {
                questionText: "What is the worst-case time complexity of QuickSort?",
                options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
                correctOption: 2,
                explanation: "QuickSort has O(n²) worst-case complexity when the pivot selection is poor, though average case is O(n log n).",
                difficulty: "Hard",
                points: 5
            },
            {
                questionText: "In a Binary Search Tree, which traversal gives sorted output?",
                options: ["Pre-order", "In-order", "Post-order", "Level-order"],
                correctOption: 1,
                explanation: "In-order traversal of a BST visits nodes in ascending order.",
                difficulty: "Medium",
                points: 5
            },
            {
                questionText: "What is the space complexity of a recursive function?",
                options: ["O(1)", "O(n)", "O(log n)", "Depends on recursion depth"],
                correctOption: 3,
                explanation: "Space complexity of recursion depends on the maximum depth of the recursion call stack.",
                difficulty: "Medium",
                points: 5
            },
            {
                questionText: "Which sorting algorithm is stable?",
                options: ["QuickSort", "HeapSort", "MergeSort", "SelectionSort"],
                correctOption: 2,
                explanation: "MergeSort is a stable sorting algorithm that maintains relative order of equal elements.",
                difficulty: "Medium",
                points: 5
            },
            {
                questionText: "What data structure is used in BFS?",
                options: ["Stack", "Queue", "Tree", "Graph"],
                correctOption: 1,
                explanation: "Breadth-First Search (BFS) uses a queue to explore nodes level by level.",
                difficulty: "Easy",
                points: 5
            },
            {
                questionText: "What is the maximum number of children a binary tree node can have?",
                options: ["1", "2", "3", "Unlimited"],
                correctOption: 1,
                explanation: "By definition, each node in a binary tree can have at most 2 children.",
                difficulty: "Easy",
                points: 5
            },
            {
                questionText: "Which of these has the best average time complexity for searching?",
                options: ["Linear Search", "Binary Search", "Hash Table", "BST"],
                correctOption: 2,
                explanation: "Hash tables provide O(1) average-case lookup time, making them fastest for searching.",
                difficulty: "Hard",
                points: 5
            },
            {
                questionText: "What is a complete binary tree?",
                options: [
                    "All nodes have 2 children",
                    "All levels filled except possibly last",
                    "Only left children exist",
                    "Tree with height 1"
                ],
                correctOption: 1,
                explanation: "A complete binary tree has all levels completely filled except possibly the last level, which is filled from left to right.",
                difficulty: "Medium",
                points: 5
            },
            {
                questionText: "What is the time complexity of inserting at the beginning of an array?",
                options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                correctOption: 2,
                explanation: "Inserting at the beginning requires shifting all existing elements, resulting in O(n) complexity.",
                difficulty: "Medium",
                points: 5
            },
            {
                questionText: "Which algorithm uses divide and conquer?",
                options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
                correctOption: 2,
                explanation: "Merge Sort is a classic divide-and-conquer algorithm that splits the array, sorts recursively, and merges.",
                difficulty: "Medium",
                points: 5
            }
        ]
    }
];

async function seedMockTests() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('\nClearing existing mock test data...');
        await MockTest.deleteMany({});
        await MockQuestion.deleteMany({});
        console.log('✅ Cleared existing data');

        // Insert mock tests and questions
        console.log('\nSeeding mock tests...');

        for (const testData of sampleMockTests) {
            const { questions, ...mockTestFields } = testData;

            // Create mock test
            const mockTest = await MockTest.create(mockTestFields);
            console.log(`Created: ${mockTest.title}`);

            // Create questions for this mock test
            const questionDocs = questions.map(q => ({
                ...q,
                mockTestId: mockTest._id
            }));

            await MockQuestion.insertMany(questionDocs);
            console.log(`  ✓ Added ${questions.length} questions`);
        }

        console.log('\n🎉 Sample mock tests seeded successfully!');
        console.log(`\nCreated ${sampleMockTests.length} mock tests with questions.`);

        await mongoose.connection.close();
        console.log('\n✅ MongoDB connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding mock tests:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

seedMockTests();
