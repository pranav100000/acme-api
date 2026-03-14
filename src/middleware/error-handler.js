const fs = require('fs');
const path = require('path');

function notFoundHandler(req, res, next) {
  const publicDir = req.app?.locals?.publicDir || path.join(__dirname, '..', '..', 'public');
  const indexPath = path.join(publicDir, 'index.html');
  const isSpaRequest = req.method === 'GET'
    && !req.path.startsWith('/api')
    && !req.path.startsWith('/health')
    && !req.path.startsWith('/debug-sentry')
    && fs.existsSync(indexPath);

  if (isSpaRequest) {
    return res.sendFile(indexPath);
  }

  return next();
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err.stack || err);

  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return res.status(status).json({ error: message });
}

module.exports = { notFoundHandler, errorHandler };
