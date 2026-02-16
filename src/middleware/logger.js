/**
 * Simple request logger middleware.
 *
 * Logs every incoming HTTP request to stdout with the format:
 *   METHOD /path - ISO-8601 timestamp
 *
 * Example: GET /api/users - 2024-03-20T12:00:00.000Z
 */
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
};

module.exports = logger;
