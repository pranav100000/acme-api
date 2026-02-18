/**
 * Simple request-logging middleware.
 *
 * Logs every incoming HTTP request to stdout with the format:
 *   METHOD /path - ISO-8601 timestamp
 *
 * Useful for local debugging; in production you would typically
 * replace this with a structured logger (e.g. pino, winston).
 */
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
};

module.exports = logger;
