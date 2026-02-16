<<<<<<< HEAD
const { exec } = require('child_process');

// Images from submissionWorker.js
const images = [
    'gcc:latest',
    'python:3.9-slim',
    'eclipse-temurin:17-jdk-alpine',
    'node:18-alpine'
];

console.log(`🐳 Pulling ${images.length} Docker images...`);

const pullNext = (index) => {
    if (index >= images.length) {
        console.log('✅ All images pulled!');
        return;
    }
    const image = images[index];
    console.log(`[${index + 1}/${images.length}] Pulling ${image}...`);

    exec(`docker pull ${image}`, (err, stdout, stderr) => {
        if (err) {
            console.error(`❌ Failed to pull ${image}:`, err.message);
        } else {
            console.log(`✅ Pulled ${image}`);
        }
        pullNext(index + 1);
    });
};

pullNext(0);
=======
const { exec } = require('child_process');

// Images from submissionWorker.js
const images = [
    'gcc:latest',
    'python:3.9-slim',
    'eclipse-temurin:17-jdk-alpine',
    'node:18-alpine'
];

console.log(`🐳 Pulling ${images.length} Docker images...`);

const pullNext = (index) => {
    if (index >= images.length) {
        console.log('✅ All images pulled!');
        return;
    }
    const image = images[index];
    console.log(`[${index + 1}/${images.length}] Pulling ${image}...`);

    exec(`docker pull ${image}`, (err, stdout, stderr) => {
        if (err) {
            console.error(`❌ Failed to pull ${image}:`, err.message);
        } else {
            console.log(`✅ Pulled ${image}`);
        }
        pullNext(index + 1);
    });
};

pullNext(0);
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
