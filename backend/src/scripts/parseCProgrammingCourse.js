const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '../../../C_Fundamentals_Question_Bank.md');
const outputPath = path.join(__dirname, '../data/questions/c_fundamentals_questions.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

if (!fs.existsSync(mdPath)) {
    console.error('Markdown file not found at:', mdPath);
    process.exit(1);
}

const mdContent = fs.readFileSync(mdPath, 'utf8');
const problems = [];

// Split by question marker
const questionChunks = mdContent.split(/### 1️⃣ Question ID: /).slice(1);

console.log(`Found ${questionChunks.length} raw question chunks.`);

const extractField = (content, labelRegex) => {
    const match = content.match(labelRegex);
    if (match) {
        return match[1].trim();
    }
    return '';
};

questionChunks.forEach((chunk, index) => {
    // Extract title (first line)
    const lines = chunk.split('\n');
    const questionId = lines[0].trim();

    const title = extractField(chunk, /\*\*4️⃣ Problem Title:\*\* (.*)/);
    const description = extractField(chunk, /\*\*5️⃣ Problem Description:\*\* (.*)/);
    const inputFormat = extractField(chunk, /\*\*6️⃣ Input Format:\*\* (.*)/);
    const outputFormat = extractField(chunk, /\*\*7️⃣ Output Format:\*\* (.*)/);
    const constraints = extractField(chunk, /\*\*8️⃣ Constraints:\*\* (.*)/);
    const sampleInput = extractField(chunk, /\*\*9️⃣ Sample Input:\*\* (.*)/);
    const sampleOutput = extractField(chunk, /\*\*🔟 Sample Output:\*\* (.*)/);
    const explanation = extractField(chunk, /\*\*1️⃣1️⃣ Explanation:\*\* (.*)/);
    const difficultyRaw = extractField(chunk, /\*\*3️⃣ Difficulty Level:\*\* (.*)/);
    const tagsRaw = extractField(chunk, /\*\*1️⃣3️⃣ Tags:\*\* (.*)/);
    const topic = extractField(chunk, /\*\*2️⃣ Module Name:\*\* (.*)/);

    // Map difficulty
    let difficulty = 'Easy';
    if (difficultyRaw.toLowerCase().includes('medium')) difficulty = 'Medium';
    if (difficultyRaw.toLowerCase().includes('hard')) difficulty = 'Hard';

    // Parse Test Cases (simplified - taking first 3)
    const tcMatch = chunk.match(/\*\*1️⃣2️⃣ Test Cases:\*\*\s*([\s\S]*?)\*\*1️⃣3️⃣/);
    const testCases = [];
    if (tcMatch) {
        const tcLines = tcMatch[1].trim().split('\n');
        tcLines.slice(0, 5).forEach(tc => {
            const parts = tc.split('|');
            if (parts.length >= 2) {
                const input = parts[0].replace(/^- \*\*TC \d+:\*\* Input: /, '').replace(/`/g, '').trim();
                const output = parts[1].replace(/Output: /, '').replace(/`/g, '').trim();
                testCases.push({ input, output });
            }
        });
    }

    const problem = {
        number: 3001 + index,
        title: title,
        description: `${description}\n\n**Input Format**\n${inputFormat}\n\n**Output Format**\n${outputFormat}`,
        difficulty: difficulty,
        topic: topic || 'General',
        tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : [],
        testCases: testCases,
        constraints: [constraints],
        examples: [{
            input: sampleInput.replace(/`/g, ''),
            output: sampleOutput.replace(/`/g, ''),
            explanation: explanation
        }]
    };

    problems.push(problem);
});

const output = {
    courseName: "C Programming Fundamentals",
    category: "C Programming",
    questions: problems
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`Successfully parsed ${problems.length} problems to ${outputPath}`);
