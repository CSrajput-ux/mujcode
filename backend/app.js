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
const studentPermissionRoutes = require('./src/routes/studentPermissionRoutes');
const judgeRoutes = require('./src/routes/judgeRoutes');
const testRoutes = require('./src/routes/testRoutes');
const mockTestRoutes = require('./src/routes/mockTestRoutes');
const assignmentRoutes = require('./src/routes/assignmentRoutes');
const facultyAnalyticsRoutes = require('./src/routes/facultyAnalyticsRoutes');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
// Enable full clustering in production, single worker in development
const numCPUs = process.env.NODE_ENV === 'production' ? os.cpus().length : 1;

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
    const http = require('http');
    const { Server } = require("socket.io");

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

    // Create HTTP Server
    const server = http.createServer(app);

    // Initialize Socket.io
    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173', 'http://localhost:5174'],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Socket Handler
    require('./src/socket/socketHandler')(io);

    const contentRoutes = require('./src/routes/contentRoutes');

    // Mount Routes
    app.use('/api/auth', authRoutes);

    // Student Routes
    app.use('/api/student', studentProgressRoutes);
    app.use('/api/student', studentProfileRoutes);
    app.use('/api/student', analyticsRoutes);
    app.use('/api/student', courseRoutes);
    app.use('/api/student', studentPermissionRoutes);

    // Core Features
    app.use('/api', problemRoutes);
    app.use('/api/judge', judgeRoutes);
    app.use('/api/compile', require('./src/routes/compileRoutes'));
    app.use('/api/evaluate', require('./src/routes/evaluationRoutes'));

    // Tests & Assignments
    app.use('/api/tests', testRoutes);
    app.use('/api/mock-tests', mockTestRoutes);
    app.use('/api/assignments', assignmentRoutes);
    app.use('/api', require('./src/routes/mcqRoutes'));
    app.use('/api', require('./src/routes/codingRoutes'));
    app.use('/api', require('./src/routes/theoryRoutes'));

    // Faculty Routes
    app.use('/api/faculty/analytics', facultyAnalyticsRoutes);
    app.use('/api/faculty', require('./src/routes/facultyRoutes'));
    app.use('/api/faculty', require('./src/routes/facultyActivityRoutes'));
    app.use('/api/permissions', require('./src/routes/permissionRoutes'));
    app.use('/api/academic', require('./src/routes/academicRoutes'));

    // Admin Routes
    app.use('/api/admin/dashboard', require('./src/routes/adminDashboardRoutes'));
    app.use('/api/admin/students', require('./src/routes/adminStudentRoutes'));
    app.use('/api/admin/faculty', require('./src/routes/adminFacultyRoutes'));
    app.use('/api/admin/system', require('./src/routes/adminSystemRoutes'));

    // Other Features
    app.use('/api/placements', require('./src/routes/placementRoutes'));
    app.use('/api', require('./src/routes/communityRoutes'));

    // NEW: Content Hub Routes
    app.use('/api/content', contentRoutes);

    // Serve Uploaded Files Statically
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    app.get('/', (req, res) => {
        res.send(`MujCode Backend is running on Worker ${process.pid}`);
    });

    // Start Server (Change app.listen to server.listen)
    server.listen(PORT, () => {
        console.log(`🟢 Worker ${process.pid} started on port ${PORT}`);
        console.log(`🔒 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
        console.log(`⚡ Socket.io enabled`);
    });
}
