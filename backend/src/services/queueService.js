// File: src/services/queueService.js
const { Queue } = require('bullmq');
const connection = { host: '127.0.0.1', port: 6379 };

// Create Submission Queue
const submissionQueue = new Queue('submissionQueue', { connection });

const addSubmissionToQueue = async (data) => {
    try {
        console.log(`📝 Queuing Submission: ${data.submissionId} | Mode: ${data.mode}`);

        // Add job to Redis Queue
        await submissionQueue.add('processSubmission', data, {
            removeOnComplete: true, // Keep Redis clean
            removeOnFail: 100 // Keep last 100 failed jobs for debugging
        });

        return { success: true };
    } catch (error) {
        console.error('❌ Queue Error:', error);
        throw error;
    }
};

module.exports = { addSubmissionToQueue };
