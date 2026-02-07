const express = require('express');
const cors = require('cors');
const cluster = require('cluster');
const os = require('os');
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();
const { connectDB, sequelize } = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const studentProgressRoutes = require('./src/routes/studentProgressRoutes');
const studentProfileRoutes = require('./src/routes/studentProfileRoutes');
const problemRoutes = require('./src/routes/problemRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const judgeRoutes = require('./src/routes/judgeRoutes');
const testRoutes = require('./src/routes/testRoutes');
const assignmentRoutes = require('./src/routes/assignmentRoutes');
const facultyAnalyticsRoutes = require('./src/routes/facultyAnalyticsRoutes');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
const numCPUs = 1; // Limited to 1 worker to reduce memory usage during development

// --- CLUSTER LOGIC ---
if (cluster.isMaster) {
    console.log(`🚀 Master ${process.pid} is running`);
    console.log(`🔥 Forking ${numCPUs} workers for performance...`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // --- START SUBMISSION WORKER ---
    const { fork } = require('child_process');
    const path = require('path');

    const workerPath = path.join(__dirname, 'src/workers/submissionWorker.js');
    console.log(`👷 Starting Submission Worker from: ${workerPath}`);

    const startWorker = () => {
        const worker = fork(workerPath);

        worker.on('exit', (code) => {
            console.log(`⚠️ Submission Worker exited with code ${code}. Restarting...`);
            setTimeout(startWorker, 3000); // Restart after 3s
        });

        console.log(`✅ Submission Worker started (PID: ${worker.pid})`);
    };

    startWorker();

    cluster.on('exit', (worker, code, signal) => {
        console.log(`⚠️ Web Worker ${worker.process.pid} died. Forking a new one...`);
        cluster.fork();
    });

} else {
    // --- WORKER LOGIC ---
    const app = express();

    // Middleware
    app.use(helmet()); // Security Headers
    app.use(compression()); // Compress responses

    // Security Hardening: Strict CORS
    app.use(cors({
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true
    }));
    app.use(express.json());

    // PostgreSQL Database Connection
    connectDB();

    // MongoDB Connection
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';
    mongoose.connect(MONGO_URI)
        .then(() => console.log(`✅ MongoDB Connected (Worker ${process.pid})`))
        .catch(err => console.error('❌ MongoDB Connection Error:', err));

    // Build Associations
    require('./src/models/pg/index');

    // Sync Models (Create Tables if not exist)
    // SQLite doesn't support 'alter: true' well for some operations.
    sequelize.sync().then(() => {
        // console.log(`✅ SQL DB Synced (Worker ${process.pid})`);
    }).catch(err => {
        console.error('❌ Database Sync Error:', err);
    });

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/student', studentProgressRoutes);
    app.use('/api/student', studentProfileRoutes);
    app.use('/api/student', analyticsRoutes);
    app.use('/api/student', courseRoutes);
    app.use('/api', problemRoutes);
    app.use('/api/judge', judgeRoutes);
    app.use('/api/tests', testRoutes);
    app.use('/api/assignments', assignmentRoutes);
    app.use('/api/faculty/analytics', facultyAnalyticsRoutes);
    app.use('/api/faculty', require('./src/routes/facultyRoutes'));
    app.use('/api/faculty', require('./src/routes/facultyActivityRoutes'));
    app.use('/api', require('./src/routes/communityRoutes'));

    app.get('/', (req, res) => {
        res.send(`MujCode Backend is running on Worker ${process.pid}`);
    });

    // Start Server
    app.listen(PORT, () => {
        console.log(`🟢 Worker ${process.pid} started on port ${PORT}`);
        console.log(`🔒 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
    });
}
