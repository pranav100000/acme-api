function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  if (status >= 500) {
    console.error(err.stack);
  }
  res.status(status).json({ error: err.message || 'Internal server error' });
}

module.exports = { errorHandler };
