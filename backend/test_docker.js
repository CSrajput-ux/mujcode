const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const tempDir = path.join(__dirname, 'temp_test');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const codePath = path.join(tempDir, 'test.py');
fs.writeFileSync(codePath, 'print("Hello from Docker")');

// Normalize path for Windows Docker
// Try standard format first
const absPath = path.resolve(tempDir).replace(/\\/g, '/'); // c:/Users/...
const dockerCmd = `docker run --rm -v "${absPath}:/app" python:3.11-alpine python /app/test.py`;

console.log(`Running: ${dockerCmd}`);

exec(dockerCmd, (err, stdout, stderr) => {
    if (err) {
        console.error('Docker Failed:', err);
        console.error('Stderr:', stderr);
    } else {
        console.log('Docker Success:', stdout);
    }
    // Cleanup
    try { fs.rmSync(tempDir, { recursive: true }); } catch (e) { }
});
