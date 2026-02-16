const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../../../');
const targetFile = path.join(rootDir, 'interview_dsa_questions.md');

// Temp files
const tempFiles = [
    'temp_p36_55.md',
    'temp_p56_100.md',
    'temp_p101_140.md',
    'temp_p141_165.md'
];

try {
    // 1. Read the original file to get the first 35 problems
    // We'll read it as a buffer to avoid encoding crashes, then convert to string and split
    const originalContent = fs.readFileSync(targetFile, 'utf8');

    // Find where Problem 36 starts (if it exists, though it might be garbled)
    // Or just find where "Problem 35" ends.
    // Problem 35 was "The Character Replacement Strategy".
    // We look for the start of Problem 36 "The Anagram Grouping" or just cut at the end of Problem 35.

    const splitKey = "## Problem 36:";
    let head = originalContent;
    if (originalContent.includes(splitKey)) {
        head = originalContent.split(splitKey)[0];
    } else {
        // Maybe it's not there or garbled.
        // Let's look for Problem 35's end: "Asked In: Amazon, Google" ... "Solution Expectation" ... "Approach: Sliding Window."
        // We'll trust the file was good up to the first append.
        // The first append happened at the end.
        // If we can't find marker, we'll assume the whole file is the head (if append failed entirely).
        // But if append succeeded with corruption, we might have garbage at end.
        // Let's rely on parsed JSON count from previous step? It said 35.
        // So likely prompt 36 isn't recognized.

        // We will take the content up to the last known good problem (35).
        const p35Index = originalContent.lastIndexOf("## Problem 35:");
        if (p35Index !== -1) {
            // Find the next "## Problem" or End of file
            // Actually, we want to KEEP Problem 35.
            // We can just append to the *cleaned* original content.
            // Let's assume the original content BEFORE my appends in this session was 35 problems.
            // I'll take the file as is, but trim any trailing garbage?
            // Or better: Re-read the file, locate the end of Problem 35, and cut there.
        }
    }

    // Easier approach: Use the parser logic again to extract 1-35 cleanly? 
    // No, parser just reads.

    // Let's just find "## Problem 36" and cut. If not found, assume it ends after 35.
    // Careful: what if I already appended 36 successfully but 56 failed?
    // The parser said 35 problems found. So 36 is likely NOT found or broken.

    // Safest bet: Find the end of Problem 35.
    const p35Str = "Problem 35: The Character Replacement Strategy";
    const p35Index = originalContent.indexOf(p35Str);

    if (p35Index === -1) {
        console.error("Could not find Problem 35 in original file. Aborting repair to avoid data loss.");
        process.exit(1);
    }

    // Find the end of this problem. It ends before "## Problem 36" or end of file.
    // It likely ends with "---".
    const nextProbIndex = originalContent.indexOf("## Problem 36:", p35Index);

    if (nextProbIndex !== -1) {
        head = originalContent.substring(0, nextProbIndex);
    } else {
        // No Problem 36 found. We assume the rest is either valid P35 content or garbage.
        // We'll take everything up to the file end, but maybe trim trailing nulls/garbage if any.
        // A simple trim() might suffice if garbage is whitespace-like or we can strip non-printable?
        head = originalContent;
    }

    head = head.trim();

    // 2. Read temp files and concat
    let newContent = head + "\n\n";

    for (const tempFile of tempFiles) {
        const tempPath = path.join(rootDir, tempFile);
        if (fs.existsSync(tempPath)) {
            const content = fs.readFileSync(tempPath, 'utf8');
            newContent += content + "\n\n";
        } else {
            console.warn(`Temp file not found: ${tempFile}`);
        }
    }

    // 3. Write back
    fs.writeFileSync(targetFile, newContent, 'utf8');
    console.log(`Repaired ${targetFile}. Total length: ${newContent.length}`);

} catch (err) {
    console.error("Repair failed:", err);
    process.exit(1);
}
