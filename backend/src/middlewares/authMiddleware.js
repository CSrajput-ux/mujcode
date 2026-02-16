// File: src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mujcode_secret_key';

const verifyToken = (req, res, next) => {
    let token;

    // 1. Check Authorization header FIRST (Specific Tab Session)
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    // 2. Check cookies SECOND (Shared/Fallback Session)
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Single Session Check: Fetch fresh user data
        // We need to require User model here or at top level. 
        // Ideally pass DB check to next middleware or do it here.
        // For strict session, we MUST check DB here.
        const User = require('../models/pg/User');

        User.findByPk(decoded.id).then(user => {
            if (!user) {
                return res.status(401).json({ error: 'User no longer exists.' });
            }

            // Check if token version matches
            // If tokenVersion is undefined in old tokens, treat as mismatch or handle gracefully?
            // Strict mode: mismatch = invalid.
            if (decoded.tokenVersion !== user.tokenVersion) {
                return res.status(401).json({ error: 'Session expired. Logged in from another device.' });
            }

            req.user = decoded; // Or better: req.user = user; (but keep consistent structure)
            req.userId = decoded.id;
            req.userRole = decoded.role;
            next();
        }).catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Auth verification failed' });
        });

    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

/**
 * NEW: Cookie-based authentication (for HttpOnly cookies)
 * Use this instead of verifyToken for cookie-based auth
 */
const verifyAuth = (req, res, next) => {
    try {
        // Get token from HttpOnly cookie
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        // Verify JWT
        const decoded = jwt.verify(token, JWT_SECRET);

        const User = require('../models/pg/User');

        User.findByPk(decoded.id).then(user => {
            if (!user) {
                return res.status(401).json({ error: 'User no longer exists.' });
            }

            if (decoded.tokenVersion !== user.tokenVersion) {
                return res.status(401).json({ error: 'Session expired. Logged in from another device.' });
            }

            // Attach user info to request
            req.user = decoded;
            req.userId = decoded.id;
            req.userRole = decoded.role;
            req.userEmail = decoded.email;

            next();
        }).catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Auth verification failed' });
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired - Please login again' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        return res.status(500).json({ error: 'Authentication error' });
    }
};

const verifyFaculty = (req, res, next) => {
    if (req.user && req.user.role === 'faculty') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Faculty role required.' });
    }
};

const verifyAdminToken = (req, res, next) => {
    // Check if user is already verified by verifyToken (if used generally)
    if (req.user) {
        if (req.user.role === 'admin' || req.user.role === 'superadmin') {
            next();
        } else {
            res.status(403).json({ error: 'Access denied. Admin role required.' });
        }
    } else {
        // If verifyToken hasn't run, run it first
        verifyToken(req, res, () => {
            if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
                next();
            } else {
                res.status(403).json({ error: 'Access denied. Admin role required.' });
            }
        });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                error: `User role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = verifyToken;
module.exports.verifyToken = verifyToken;
module.exports.verifyAuth = verifyAuth; // NEW: Cookie-based auth
module.exports.protect = verifyToken; // Alias for consistency
module.exports.authorize = authorize;
module.exports.verifyFaculty = verifyFaculty;
module.exports.verifyAdminToken = verifyAdminToken;
module.exports.authMiddleware = verifyToken; // For those preferring destructured import
