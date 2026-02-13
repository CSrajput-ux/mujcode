const TestSubmission = require('../models/mongo/TestSubmission');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`⚡ Client connected: ${socket.id}`);

        // Join a specific test room (e.g., testId_studentId or just testId)
        socket.on('join_test', ({ testId, studentId }) => {
            const room = `test_${testId}_${studentId}`;
            socket.join(room);
            console.log(`Student ${studentId} joined test room: ${room}`);
        });

        // Handle Violation
        socket.on('violation', async (data) => {
            const { testId, studentId, type, message, snapshot } = data;
            const room = `test_${testId}_${studentId}`;

            console.log(`⚠️ Violation received from ${studentId}: ${type} - ${message}`);

            try {
                // Find and update the active submission
                // optimize: Using findOneAndUpdate to push log atomically
                const submission = await TestSubmission.findOneAndUpdate(
                    { testId: testId, studentId: studentId, status: 'In Progress' },
                    {
                        $push: {
                            violationLogs: {
                                reason: `${type}: ${message}`,
                                timestamp: new Date()
                                // Note: We might want to store snapshot URL later if we upload it to cloud
                            }
                        },
                        $inc: { warningsIssued: 1 }
                    },
                    { new: true }
                );

                if (submission) {
                    // Check if max warnings exceeded (e.g., > 10)
                    if (submission.warningsIssued >= 10) {
                        // Force Auto-Submit logic could be triggered here or client side
                        io.to(room).emit('force_submit', { reason: 'Maximum violations exceeded.' });
                    }
                } else {
                    console.warn(`No active submission found for logging violation: ${testId} / ${studentId}`);
                }

            } catch (err) {
                console.error("Error logging violation:", err);
            }
        });

        // BATCHED Violations (Performance Optimization)
        socket.on('violation_batch', async (data) => {
            const { testId, studentId, violations } = data;
            const room = `test_${testId}_${studentId}`;

            console.log(`📦 Batch received: ${violations.length} violations from ${studentId}`);

            try {
                const violationLogs = violations.map(v => ({
                    reason: `${v.type}: ${v.message}`,
                    timestamp: new Date(v.timestamp)
                }));

                const submission = await TestSubmission.findOneAndUpdate(
                    { testId: testId, studentId: studentId, status: 'In Progress' },
                    {
                        $push: { violationLogs: { $each: violationLogs } },
                        $inc: { warningsIssued: violations.length }
                    },
                    { new: true }
                );

                if (submission && submission.warningsIssued >= 10) {
                    io.to(room).emit('force_submit', { reason: 'Maximum violations exceeded.' });
                }
            } catch (err) {
                console.error("Error logging batch:", err);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
};
