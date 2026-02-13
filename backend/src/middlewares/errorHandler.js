// Centralized error handling middleware
// Ensures consistent error responses and prevents crashes from uncaught errors in routes.

const errorHandler = (err, req, res, next) => {
    // Default to 500 if statusCode not set
    const statusCode = err.statusCode || 500;

    // Avoid leaking internal details in production
    const response = {
        error: statusCode === 500 ? 'Internal server error' : err.message || 'Unexpected error'
    };

    // Optionally include more debug info in development
    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
    }

    // Log to console or any logging service (Winston, Datadog, etc.)
    console.error('🔥 API Error:', {
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
        user: req.user ? { id: req.user.id, role: req.user.role } : null
    });

    res.status(statusCode).json(response);
};

module.exports = errorHandler;

