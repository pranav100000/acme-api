/**
 * Request logger middleware that logs method, path, status code, and duration
 */
const logger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms - ${timestamp}`);
  });

  next();
};

module.exports = logger;
