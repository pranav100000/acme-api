/**
 * Simple request logger middleware
 */
// TODO: Replace with a structured logging library (e.g., winston, pino)
// TODO: Add request duration tracking and response status code logging
// TODO: Add request ID generation for correlating logs across services
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
};

module.exports = logger;
