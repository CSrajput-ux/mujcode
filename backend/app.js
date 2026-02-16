<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const cluster = require('cluster');
const os = require('os');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { connectDB, sequelize } = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');

const problemRoutes = require('./src/routes/problemRoutes');
const analyticsRoutes = require('./src/modules/student/routes/analyticsRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const studentPermissionRoutes = require('./src/routes/studentPermissionRoutes');
const judgeRoutes = require('./src/routes/judgeRoutes');
const testRoutes = require('./src/routes/testRoutes');
const mockTestRoutes = require('./src/routes/mockTestRoutes');
const assignmentRoutes = require('./src/routes/assignmentRoutes');
const facultyAnalyticsRoutes = require('./src/modules/faculty/routes/facultyAnalyticsRoutes');
const universityRoutes = require('./src/routes/universityRoutes');
const mongoose = require('mongoose');
const requestLogger = require('./src/middlewares/requestLogger');
const errorHandler = require('./src/middlewares/errorHandler');
const { apiRateLimiter, authRateLimiter } = require('./src/middlewares/rateLimiter');

const PORT = process.env.PORT || 5000;
// In production you should scale using multiple container/PM2 instances behind
// a load balancer instead of Node.js cluster to avoid EADDRINUSE issues.
const enableCluster = process.env.ENABLE_CLUSTER === 'true';
const numCPUs = process.env.CLUSTER_WORKERS
    ? parseInt(process.env.CLUSTER_WORKERS)
    : (enableCluster ? os.cpus().length : 1);

if (enableCluster && cluster.isMaster) {
    console.log(`🚀 Master ${process.pid} is running`);
    console.log(`🔥 Forking ${numCPUs} workers for performance...`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Optional: submission worker can be moved to its own service in future.
    const { fork } = require('child_process');
    const workerPath = path.join(__dirname, 'src/workers/submissionWorker.js');
    console.log(`👷 Starting Submission Worker from: ${workerPath}`);

    const startWorker = () => {
        const worker = fork(workerPath);
        worker.on('exit', (code) => {
            console.log(`⚠️ Submission Worker exited with code ${code}. Restarting...`);
            setTimeout(startWorker, 3000);
        });
        console.log(`✅ Submission Worker started (PID: ${worker.pid})`);
    };

    startWorker();

    cluster.on('exit', (worker) => {
        console.log(`⚠️ Web Worker ${worker.process.pid} died. Forking a new one...`);
        cluster.fork();
    });
} else {
    // --- WORKER / SINGLE PROCESS LOGIC ---
    const app = express();
    const http = require('http');
    const { Server } = require("socket.io");

    // AG-FIX: Ensure Submission Worker is started in Single Process Mode
    const { fork } = require('child_process');
    const workerPath = path.join(__dirname, 'src/workers/submissionWorker.js');
    console.log(`👷 Starting Submission Worker (Single Process Mode) from: ${workerPath}`);

    let submissionWorker;
    const startSubmissionWorker = () => {
        submissionWorker = fork(workerPath);
        submissionWorker.on('exit', (code) => {
            console.error(`⚠️ Submission Worker exited with code ${code}. Restarting in 3s...`);
            setTimeout(startSubmissionWorker, 3000);
        });
    };
    startSubmissionWorker();

    // Security & performance middleware
    app.use(helmet());
    app.use(compression());

    app.use(cors({
        origin: process.env.CORS_ORIGIN
            ? process.env.CORS_ORIGIN.split(',')
            : ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true
    }));

    app.use(express.json());
    app.use(cookieParser()); // Parse cookies from requests

    // Request logging (for observability)
    app.use(requestLogger);

    // Global rate limiter for all API routes
    app.use('/api', apiRateLimiter);

    // PostgreSQL Database Connection
    connectDB();

    // MongoDB Connection with pooling
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';
    mongoose.connect(MONGO_URI, {
        maxPoolSize: 50,
        minPoolSize: 5
    })
        .then(() => console.log(`✅ MongoDB Connected (PID ${process.pid})`))
        .catch(err => console.error('❌ MongoDB Connection Error:', err));

    // Build Associations
    require('./src/models/pg/index');

    // Sync Models (Create Tables if not exist)
    sequelize.sync().catch(err => {
        console.error('❌ Database Sync Error:', err);
        if (err.parent) console.error('Parent Error:', err.parent);
    });

    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN
                ? process.env.CORS_ORIGIN.split(',')
                : ['http://localhost:5173', 'http://localhost:5174'],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    require('./src/socket/socketHandler')(io);

    const contentRoutes = require('./src/routes/contentRoutes');

    // Auth routes with stricter rate limit
    app.use('/api/auth', authRoutes);

    // Student Routes
    app.use('/api/student', require('./src/modules/student/routes/studentProgressRoutes'));
    app.use('/api/student', require('./src/modules/student/routes/studentProfileRoutes'));
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
    app.use('/api/faculty', require('./src/modules/faculty/routes/facultyRoutes'));
    app.use('/api/faculty', require('./src/modules/faculty/routes/facultyActivityRoutes'));
    app.use('/api/permissions', require('./src/routes/permissionRoutes'));
    app.use('/api/academic', require('./src/routes/academicRoutes'));
    app.use('/api/university', universityRoutes); // ERP Structure Routes

    // Admin Routes
    app.use('/api/admin/roles', require('./src/modules/admin/routes/adminRoleRoutes'));
    app.use('/api/admin/dashboard', require('./src/modules/admin/routes/adminDashboardRoutes'));
    app.use('/api/admin/students', require('./src/modules/admin/routes/adminStudentRoutes'));
    app.use('/api/admin/faculty', require('./src/modules/admin/routes/adminFacultyRoutes'));
    app.use('/api/admin/system', require('./src/modules/admin/routes/adminSystemRoutes'));

    // Other Features
    // Placements (Split by Role)
    app.use('/api/student/placements', require('./src/modules/student/routes/studentPlacementRoutes'));
    app.use('/api/admin/placements', require('./src/modules/admin/routes/adminPlacementRoutes'));

    app.use('/api', require('./src/routes/communityRoutes'));

    // Content Hub Routes
    app.use('/api/content', contentRoutes);

    // Serve Uploaded Files Statically
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    app.get('/', (req, res) => {
        res.send(`MujCode Backend is running on PID ${process.pid}`);
    });

    // Central error handler (kept last)
    app.use(errorHandler);

    server.listen(PORT, () => {
        console.log(`🟢 Server PID ${process.pid} started on port ${PORT}`);
        console.log(`🔒 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
        console.log(`⚡ Socket.io enabled`);
    });
}
=======
const express = require('express');
const cors = require('cors');
const cluster = require('cluster');
const os = require('os');
const path = require('path');
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
const universityRoutes = require('./src/routes/universityRoutes');
const mongoose = require('mongoose');
const requestLogger = require('./src/middlewares/requestLogger');
const errorHandler = require('./src/middlewares/errorHandler');
const { apiRateLimiter, authRateLimiter } = require('./src/middlewares/rateLimiter');

const PORT = process.env.PORT || 5000;
// In production you should scale using multiple container/PM2 instances behind
// a load balancer instead of Node.js cluster to avoid EADDRINUSE issues.
const enableCluster = process.env.ENABLE_CLUSTER === 'true';
const numCPUs = enableCluster ? os.cpus().length : 1;

if (enableCluster && cluster.isMaster) {
    console.log(`🚀 Master ${process.pid} is running`);
    console.log(`🔥 Forking ${numCPUs} workers for performance...`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Optional: submission worker can be moved to its own service in future.
    const { fork } = require('child_process');
    const workerPath = path.join(__dirname, 'src/workers/submissionWorker.js');
    console.log(`👷 Starting Submission Worker from: ${workerPath}`);

    const startWorker = () => {
        const worker = fork(workerPath);
        worker.on('exit', (code) => {
            console.log(`⚠️ Submission Worker exited with code ${code}. Restarting...`);
            setTimeout(startWorker, 3000);
        });
        console.log(`✅ Submission Worker started (PID: ${worker.pid})`);
    };

    startWorker();

    cluster.on('exit', (worker) => {
        console.log(`⚠️ Web Worker ${worker.process.pid} died. Forking a new one...`);
        cluster.fork();
    });
} else {
    // --- WORKER / SINGLE PROCESS LOGIC ---
    const app = express();
    const http = require('http');
    const { Server } = require("socket.io");

    // AG-FIX: Ensure Submission Worker is started in Single Process Mode
    const { fork } = require('child_process');
    const workerPath = path.join(__dirname, 'src/workers/submissionWorker.js');
    console.log(`👷 Starting Submission Worker (Single Process Mode) from: ${workerPath}`);

    let submissionWorker;
    const startSubmissionWorker = () => {
        submissionWorker = fork(workerPath);
        submissionWorker.on('exit', (code) => {
            console.error(`⚠️ Submission Worker exited with code ${code}. Restarting in 3s...`);
            setTimeout(startSubmissionWorker, 3000);
        });
    };
    startSubmissionWorker();

    // Security & performance middleware
    app.use(helmet());
    app.use(compression());

    app.use(cors({
        origin: process.env.CORS_ORIGIN
            ? process.env.CORS_ORIGIN.split(',')
            : ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true
    }));

    app.use(express.json());

    // Request logging (for observability)
    app.use(requestLogger);

    // Global rate limiter for all API routes
    app.use('/api', apiRateLimiter);

    // PostgreSQL Database Connection
    connectDB();

    // MongoDB Connection with pooling
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';
    mongoose.connect(MONGO_URI, {
        maxPoolSize: 50,
        minPoolSize: 5
    })
        .then(() => console.log(`✅ MongoDB Connected (PID ${process.pid})`))
        .catch(err => console.error('❌ MongoDB Connection Error:', err));

    // Build Associations
    require('./src/models/pg/index');

    // Sync Models (Create Tables if not exist)
    sequelize.sync().catch(err => {
        console.error('❌ Database Sync Error:', err);
        if (err.parent) console.error('Parent Error:', err.parent);
    });

    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN
                ? process.env.CORS_ORIGIN.split(',')
                : ['http://localhost:5173', 'http://localhost:5174'],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    require('./src/socket/socketHandler')(io);

    const contentRoutes = require('./src/routes/contentRoutes');

    // Auth routes with stricter rate limit
    app.use('/api/auth', authRateLimiter, authRoutes);

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
    app.use('/api/university', universityRoutes); // ERP Structure Routes

    // Admin Routes
    app.use('/api/admin/roles', require('./src/routes/adminRoleRoutes'));
    app.use('/api/admin/dashboard', require('./src/routes/adminDashboardRoutes'));
    app.use('/api/admin/students', require('./src/routes/adminStudentRoutes'));
    app.use('/api/admin/faculty', require('./src/routes/adminFacultyRoutes'));
    app.use('/api/admin/system', require('./src/routes/adminSystemRoutes'));

    // Other Features
    app.use('/api/placements', require('./src/routes/placementRoutes'));
    app.use('/api', require('./src/routes/communityRoutes'));

    // Content Hub Routes
    app.use('/api/content', contentRoutes);

    // Serve Uploaded Files Statically
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    app.get('/', (req, res) => {
        res.send(`MujCode Backend is running on PID ${process.pid}`);
    });

    // Central error handler (kept last)
    app.use(errorHandler);

    server.listen(PORT, () => {
        console.log(`🟢 Server PID ${process.pid} started on port ${PORT}`);
        console.log(`🔒 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
        console.log(`⚡ Socket.io enabled`);
    });
}
>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
