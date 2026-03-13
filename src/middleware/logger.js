/**
 * Simple request logger middleware
 */
function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`${req.method} ${req.path} - ${timestamp}`);
  next();
}

module.exports = logger;
