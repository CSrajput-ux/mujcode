const Redis = require('ioredis');

// Singleton Redis Client
const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: 3
});

redis.on('connect', () => {
    console.log('✅ Redis Cache Connected');
});

redis.on('error', (err) => {
    console.error('❌ Redis Cache Error:', err);
});

module.exports = {
    // Get cached data
    get: async (key) => {
        try {
            const data = await redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Cache Get Error:', error);
            return null;
        }
    },

    // Set data with TTL (Time To Live in seconds)
    set: async (key, value, ttl = 300) => {
        try {
            await redis.set(key, JSON.stringify(value), 'EX', ttl);
        } catch (error) {
            console.error('Cache Set Error:', error);
        }
    },

    // Remove key
    del: async (key) => {
        try {
            await redis.del(key);
        } catch (error) {
            console.error('Cache Del Error:', error);
        }
    },

    redis
};
