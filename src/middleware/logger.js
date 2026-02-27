/**
 * @module middleware/logger
 * @description Express middleware for logging incoming HTTP requests.
 */

/**
 * Simple request logger middleware.
 * Logs the HTTP method, path, and current timestamp to stdout.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
};

module.exports = logger;
