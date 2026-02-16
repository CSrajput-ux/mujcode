<<<<<<< HEAD
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const tempDir = path.join(__dirname, 'temp_test');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const code = 'print("Hello from Docker")';
fs.writeFileSync(path.join(tempDir, 'main.py'), code);

// Normalize path for Windows Docker
const normalizedPath = tempDir.replace(/\\/g, '/');

const dockerCmd = `docker run --rm -v "${tempDir}:/app" python:3.9-slim sh -c "python -u /app/main.py"`;

console.log('Executing:', dockerCmd);

exec(dockerCmd, (error, stdout, stderr) => {
    if (error) {
        console.error('Error:', error);
    }
    console.log('Stdout:', stdout);
    console.log('Stderr:', stderr);

    // Cleanup
    try {
        fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) { }
});
=======
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const tempDir = path.join(__dirname, 'temp_test');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const code = 'print("Hello from Docker")';
fs.writeFileSync(path.join(tempDir, 'main.py'), code);

// Normalize path for Windows Docker
const normalizedPath = tempDir.replace(/\\/g, '/');

const dockerCmd = `docker run --rm -v "${tempDir}:/app" python:3.9-slim sh -c "python -u /app/main.py"`;

console.log('Executing:', dockerCmd);

exec(dockerCmd, (error, stdout, stderr) => {
    if (error) {
        console.error('Error:', error);
    }
    console.log('Stdout:', stdout);
    console.log('Stderr:', stderr);

    // Cleanup
    try {
        fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) { }
});
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
