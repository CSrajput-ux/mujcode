const mongoose = require('mongoose');
const { sequelize } = require('../config/database');

/**
 * Health check utilities for monitoring system components
 */

/**
 * Check MongoDB connection health
 * @returns {Promise<{status: string, responseTime: number}>}
 */
async function checkMongoHealth() {
    const startTime = Date.now();

    try {
        // Ping MongoDB to check connection
        await mongoose.connection.db.admin().ping();
        const responseTime = Date.now() - startTime;

        return {
            status: 'Healthy',
            responseTime,
            connection: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
        };
    } catch (error) {
        return {
            status: 'Down',
            responseTime: Date.now() - startTime,
            error: error.message,
            connection: 'Disconnected'
        };
    }
}

/**
 * Check PostgreSQL connection health
 * @returns {Promise<{status: string, responseTime: number}>}
 */
async function checkPostgresHealth() {
    const startTime = Date.now();

    try {
        await sequelize.authenticate();
        const responseTime = Date.now() - startTime;

        return {
            status: 'Healthy',
            responseTime,
            connection: 'Connected'
        };
    } catch (error) {
        return {
            status: 'Down',
            responseTime: Date.now() - startTime,
            error: error.message,
            connection: 'Disconnected'
        };
    }
}

/**
 * Check Redis connection health (if configured)
 * @returns {Promise<{status: string}>}
 */
async function checkRedisHealth() {
    try {
        // Check if Redis client is configured
        const redisClient = global.redisClient || require('../config/redis');

        if (!redisClient) {
            return {
                status: 'Not Configured',
                message: 'Redis not configured in this environment'
            };
        }

        // Try to ping Redis
        await redisClient.ping();

        return {
            status: 'Active',
            connection: 'Connected'
        };
    } catch (error) {
        return {
            status: 'Inactive',
            error: error.message,
            connection: 'Disconnected'
        };
    }
}

/**
 * Check API server health
 * @returns {Promise<{status: string, uptime: number}>}
 */
async function checkAPIHealth() {
    try {
        const uptime = process.uptime(); // Server uptime in seconds
        const memoryUsage = process.memoryUsage();

        return {
            status: 'Running',
            uptime: Math.floor(uptime),
            memory: {
                used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
                total: Math.round(memoryUsage.heapTotal / 1024 / 1024) // MB
            },
            pid: process.pid
        };
    } catch (error) {
        return {
            status: 'Down',
            error: error.message
        };
    }
}

/**
 * Check background workers health
 * @returns {Promise<{status: string}>}
 */
async function checkWorkersHealth() {
    try {
        // Check if running in cluster mode
        const cluster = require('cluster');

        if (cluster.isMaster || cluster.isPrimary) {
            const workers = Object.keys(cluster.workers || {}).length;
            return {
                status: workers > 0 ? 'Online' : 'No Workers',
                workerCount: workers,
                mode: 'Cluster'
            };
        }

        // Single process mode
        return {
            status: 'Online',
            workerCount: 1,
            mode: 'Single Process'
        };
    } catch (error) {
        return {
            status: 'Offline',
            error: error.message,
            mode: 'Unknown'
        };
    }
}

/**
 * Get comprehensive system health
 * @returns {Promise<Object>}
 */
async function getSystemHealth() {
    try {
        const [mongo, postgres, redis, api, workers] = await Promise.all([
            checkMongoHealth(),
            checkPostgresHealth(),
            checkRedisHealth(),
            checkAPIHealth(),
            checkWorkersHealth()
        ]);

        return {
            database: {
                mongo,
                postgres
            },
            cache: redis,
            api,
            workers,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error getting system health:', error);
        return {
            error: 'Failed to retrieve system health',
            message: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = {
    checkMongoHealth,
    checkPostgresHealth,
    checkRedisHealth,
    checkAPIHealth,
    checkWorkersHealth,
    getSystemHealth
};
