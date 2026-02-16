<<<<<<< HEAD
const rateLimit = require('express-rate-limit');

// Basic IP-based rate limiter for all APIs
// Tune these values based on real traffic patterns and infra capacity.
const apiRateLimiter = rateLimit({
    windowMs: 60 * 1000,       // 1 minute
    max: 300,                  // 300 requests per IP per minute
    standardHeaders: true,
    legacyHeaders: false
});

// Stricter limiter for auth-related endpoints (login, signup, reset password)
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 20,                   // 20 attempts per 15 minutes
    message: {
        error: 'Too many attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    apiRateLimiter,
    authRateLimiter
};

=======
const rateLimit = require('express-rate-limit');

// Basic IP-based rate limiter for all APIs
// Tune these values based on real traffic patterns and infra capacity.
const apiRateLimiter = rateLimit({
    windowMs: 60 * 1000,       // 1 minute
    max: 300,                  // 300 requests per IP per minute
    standardHeaders: true,
    legacyHeaders: false
});

// Stricter limiter for auth-related endpoints (login, signup, reset password)
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 20,                   // 20 attempts per 15 minutes
    message: {
        error: 'Too many attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    apiRateLimiter,
    authRateLimiter
};

>>>>>>> 54c65193bef0adb8c05bc7e519e5e1e947a58c34
