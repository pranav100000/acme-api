function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.statusCode || 500;
  if (status >= 500) {
    console.error(err.stack || err);
  }

  res.status(status).json({ error: err.message || 'Internal server error' });
}

module.exports = errorHandler;
