const Redis = require('ioredis');

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';

const redis = new Redis({
    port: REDIS_PORT,
    host: REDIS_HOST,
    maxRetriesPerRequest: null, // Critical for BullMQ if used later
    retryStrategy: (times) => {
        // Exponential backoff with max 2s delay
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redis.on('connect', () => {
    console.log('✅ Redis Connected');
});

redis.on('error', (err) => {
    console.warn('⚠️ Redis Connection Error:', err.message);
    // We don't crash backend if Redis is down, just warn
});

module.exports = redis;
