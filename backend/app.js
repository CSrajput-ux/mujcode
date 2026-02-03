const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB, sequelize } = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const studentProgressRoutes = require('./src/routes/studentProgressRoutes');
const studentProfileRoutes = require('./src/routes/studentProfileRoutes');
const problemRoutes = require('./src/routes/problemRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const judgeRoutes = require('./src/routes/judgeRoutes');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Database Connection
connectDB();

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujcode';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Build Associations
require('./src/models/pg/index');

// Sync Models (Create Tables if not exist)
sequelize.sync().then(() => {
    console.log('✅ Unified Database Synced (Postgres Tables Created).');
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

app.get('/', (req, res) => {
    res.send('MujCode Backend is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
