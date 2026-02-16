const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '../../../interview_dsa_questions.md');
const outputPath = path.join(__dirname, '../data/questions/dsa_interview_questions.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

const mdContent = fs.readFileSync(mdPath, 'utf8');

const problems = [];
let currentProblem = null;
let currentSection = null; // Description, Input, Output, Examples, etc.

const lines = mdContent.split('\n');

// Helper to save current problem
const saveProblem = () => {
    if (currentProblem) {
        // Clean up description and other fields
        if (currentProblem.description) currentProblem.description = currentProblem.description.trim();

        // Parse test cases if possible, or leave empty if not strictly structured
        // For now, we'll try to extract at least one example as a test case

        // Adjust number to avoid conflicts (Start from 2000)
        currentProblem.originalNumber = currentProblem.number;
        currentProblem.number = 2000 + parseInt(currentProblem.number);

        problems.push(currentProblem);
    }
};

const saveSection = () => {
    if (!currentProblem || !currentSection) return;
    const content = buffer.join('\n').trim();

    if (currentSection === 'Description') {
        currentProblem.description = content;
    } else if (currentSection === 'InputFormat') {
        currentProblem.description += '\n\n**Input Format**\n' + content;
    } else if (currentSection === 'OutputFormat') {
        currentProblem.description += '\n\n**Output Format**\n' + content;
    } else if (currentSection === 'Examples') {
        const inputMatch = content.match(/Input:\n?([\s\S]*?)\n\nOutput:/);
        const outputMatch = content.match(/Output:\n?([\s\S]*?)(\n\n|$)/);
        if (inputMatch) currentProblem.sampleInput = inputMatch[1].trim();
        if (outputMatch) currentProblem.sampleOutput = outputMatch[1].trim();
    }
    buffer = [];
    currentSection = null;
};

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Problem Header
    if (line.startsWith('## Problem ')) {
        saveSection(); // Save previous section
        saveProblem(); // Save previous problem

        const match = trimmed.match(/Problem (\d+):/);
        const number = match ? match[1] : '0';
        const title = trimmed.split(':')[1] ? trimmed.split(':')[1].trim() : 'Unknown Problem';

        currentProblem = {
            number: number,
            title: title,
            description: '',
            difficulty: 'Medium',
            topic: 'General',
            tags: [],
            testCases: [],
            sampleInput: '',
            sampleOutput: '',
            explanation: '',
            constraints: ''
        };
        currentSection = null;
        buffer = [];
        continue;
    }

    if (!currentProblem) continue;

    // Metadata
    if (line.startsWith('**Difficulty:**')) {
        currentProblem.difficulty = line.split('**')[2].trim();
        continue;
    }
    if (line.startsWith('**Topic:**')) {
        currentProblem.topic = line.split('**')[2].trim();
        currentProblem.tags.push(currentProblem.topic);
        continue;
    }
    if (line.startsWith('**Asked In:**')) {
        const companies = line.split('**')[2].trim().split(',').map(c => c.trim());
        currentProblem.tags.push(...companies);
        currentProblem.companies = companies.join(', ');
        continue;
    }
    if (line.startsWith('**Constraints:**')) {
        saveSection();
        currentSection = 'Constraints';
        continue;
    }

    // Sections
    if (line.startsWith('### Problem Description')) {
        saveSection();
        currentSection = 'Description';
        continue;
    }
    if (line.startsWith('### Input Format')) {
        saveSection();
        currentSection = 'InputFormat';
        continue;
    }
    if (line.startsWith('### Output Format')) {
        saveSection();
        currentSection = 'OutputFormat';
        continue;
    }
    if (line.startsWith('### Examples')) {
        saveSection();
        currentSection = 'Examples';
        continue;
    }
    if (line.startsWith('### Test Cases') || line.startsWith('### Solution Expectation')) {
        saveSection();
        currentSection = null; // Ignore these for description
        continue;
    }

    // Ignore internal separators if buffer empty
    if (trimmed === '---' && buffer.length === 0) continue;

    // Capture content
    if (currentSection) {
        buffer.push(line);
    }
}
saveSection(); // Save last section

saveProblem(); // Save last

const output = {
    courseName: "DSA Interview Questions Company Wise",
    category: "Interview",
    questions: problems
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`Parsed ${problems.length} problems to ${outputPath}`);
