// File: src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mujcode_secret_key';

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

const verifyFaculty = (req, res, next) => {
    if (req.user && req.user.role === 'faculty') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Faculty role required.' });
    }
};

module.exports = verifyToken;
module.exports.verifyToken = verifyToken;
module.exports.verifyFaculty = verifyFaculty;
module.exports.authMiddleware = verifyToken; // For those preferring destructured import
