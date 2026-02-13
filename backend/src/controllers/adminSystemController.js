const ActivityLog = require('../models/mongo/ActivityLog');
const { getSystemHealth } = require('../utils/healthChecks');
const ServerUptime = require('../models/mongo/ServerUptime');
const mongoose = require('mongoose');

/**
 * Get recent activity logs
 * GET /api/admin/activity-logs?limit=10
 */
exports.getActivityLogs = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 10, 50); // Max 50
        const type = req.query.type; // Optional filter by type

        const query = type ? { type } : {};

        const logs = await ActivityLog.find(query)
            .sort({ createdAt: -1 }) // Latest first
            .limit(limit)
            .lean();

        res.json({
            success: true,
            count: logs.length,
            logs
        });
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch activity logs',
            message: error.message
        });
    }
};

/**
 * Get system health status
 * GET /api/admin/system-health
 */
exports.getSystemHealth = async (req, res) => {
    try {
        const health = await getSystemHealth();

        res.json({
            success: true,
            health,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching system health:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch system health',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

/**
 * Get server uptime statistics
 * GET /api/admin/uptime
 */
exports.getUptime = async (req, res) => {
    try {
        const uptimeRecord = await ServerUptime.getInstance();
        const percentage = uptimeRecord.calculateUptime();

        // Get the most recent downtime event
        const lastDowntime = uptimeRecord.restartEvents.length > 0
            ? uptimeRecord.restartEvents[uptimeRecord.restartEvents.length - 1].timestamp
            : null;

        // Calculate current uptime duration
        const currentUptimeMs = Date.now() - uptimeRecord.startTime.getTime();
        const currentUptimeDays = Math.floor(currentUptimeMs / (1000 * 60 * 60 * 24));
        const currentUptimeHours = Math.floor((currentUptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        res.json({
            success: true,
            uptime: {
                percentage: parseFloat(percentage.toFixed(2)),
                lastDowntime,
                startTime: uptimeRecord.startTime,
                totalDowntime: uptimeRecord.totalDowntime,
                restartCount: uptimeRecord.restartEvents.length,
                currentUptime: {
                    days: currentUptimeDays,
                    hours: currentUptimeHours,
                    totalMs: currentUptimeMs
                }
            }
        });
    } catch (error) {
        console.error('Error fetching uptime:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch uptime statistics',
            message: error.message
        });
    }
};

/**
 * Get platform statistics
 * GET /api/admin/platform-stats
 */
exports.getPlatformStats = async (req, res) => {
    try {
        // Import models dynamically to avoid circular dependencies
        const Course = require('../models/mongo/Course');
        const User = require('../models/pg/User');

        // Get test attempts count (from MongoDB if you have TestAttempt model)
        let testsCount = 0;
        try {
            const TestAttempt = mongoose.model('TestAttempt');
            testsCount = await TestAttempt.countDocuments();
        } catch (err) {
            // Model might not exist, use 0
            console.log('TestAttempt model not found, using 0');
        }

        // Get problems solved count (from MongoDB if you have Submission model)
        let problemsSolved = 0;
        try {
            const Submission = mongoose.model('Submission');
            problemsSolved = await Submission.countDocuments({ status: 'accepted' });
        } catch (err) {
            // Model might not exist, use 0
            console.log('Submission model not found, using 0');
        }

        // Get active sessions (users active in last 15 minutes)
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        let activeSessions = 0;
        try {
            activeSessions = await User.count({
                where: {
                    lastActive: {
                        [require('sequelize').Op.gte]: fifteenMinutesAgo
                    }
                }
            });
        } catch (err) {
            // lastActive column might not exist
            console.log('lastActive column not found, using 0');
        }

        // Get active courses count
        const coursesActive = await Course.countDocuments({ status: 'active' });

        res.json({
            success: true,
            stats: {
                testsCount,
                problemsSolved,
                activeSessions,
                coursesActive
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching platform stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch platform statistics',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

/**
 * Get comprehensive admin dashboard data (all-in-one)
 * GET /api/admin/dashboard-data
 */
exports.getDashboardData = async (req, res) => {
    try {
        const [activityLogs, health, uptime, stats] = await Promise.allSettled([
            ActivityLog.find().sort({ createdAt: -1 }).limit(10).lean(),
            getSystemHealth(),
            ServerUptime.getInstance().then(record => ({
                percentage: parseFloat(record.calculateUptime().toFixed(2)),
                lastDowntime: record.restartEvents.length > 0
                    ? record.restartEvents[record.restartEvents.length - 1].timestamp
                    : null
            })),
            (async () => {
                const Course = require('../models/mongo/Course');
                const coursesActive = await Course.countDocuments({ status: 'active' });
                return {
                    testsCount: 0, // Placeholder
                    problemsSolved: 0, // Placeholder
                    activeSessions: 0, // Placeholder
                    coursesActive
                };
            })()
        ]);

        res.json({
            success: true,
            data: {
                activityLogs: activityLogs.status === 'fulfilled' ? activityLogs.value : [],
                systemHealth: health.status === 'fulfilled' ? health.value : null,
                uptime: uptime.status === 'fulfilled' ? uptime.value : null,
                platformStats: stats.status === 'fulfilled' ? stats.value : null
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard data',
            message: error.message
        });
    }
};
