const redis = require('../config/redis');

// Duration in seconds (e.g., 3600 = 1 hr)
const DEFAULT_EXPIRATION = 3600;

const cache = (duration = DEFAULT_EXPIRATION) => {
    return async (req, res, next) => {
        // Skip caching for non-GET requests (safety)
        if (req.method !== 'GET') {
            return next();
        }

        // AG-FIX: Skip cache if userId is present (User-specific data)
        if (req.query.userId) {
            return next();
        }

        const key = `cache:${req.originalUrl}`;

        try {
            const cachedData = await redis.get(key);
            if (cachedData) {
                // console.log(`⚡ Cache Hit: ${key}`);
                return res.json(JSON.parse(cachedData));
            }

            // Hook into res.json to save the response to Redis
            const originalJson = res.json;
            res.json = (body) => {
                // Save to Redis asynchronously (fire & forget)
                if (res.statusCode === 200) {
                    redis.setex(key, duration, JSON.stringify(body)).catch(err => {
                        console.error('Redis Set Error:', err);
                    });
                }

                // Call original logic
                return originalJson.call(res, body);
            };

            next();
        } catch (error) {
            console.error('Redis Cache Middleware Error:', error);
            next(); // Proceed even if cache fails
        }
    };
};

// Function to manually invalidate cache (useful for admin updates)
const clearCache = async (pattern) => {
    try {
        const keys = await redis.keys(`cache:${pattern}*`);
        if (keys.length > 0) {
            await redis.del(keys);
            console.log(`Cleared ${keys.length} cache keys for pattern: ${pattern}`);
        }
    } catch (err) {
        console.error('Clear Cache Error:', err);
    }
}

module.exports = { cache, clearCache };
