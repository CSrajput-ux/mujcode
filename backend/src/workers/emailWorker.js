// Email Worker
const { Worker } = require('bullmq');

const worker = new Worker('emailQueue', async job => {
    // Send email
    console.log('Sending email...');
});
