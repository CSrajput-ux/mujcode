const morgan = require('morgan');

// HTTP request logger using morgan.
// In production, you can redirect this to a file or log aggregation service.

const requestLogger = morgan('combined');

module.exports = requestLogger;

