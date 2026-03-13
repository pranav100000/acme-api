const express = require('express');
const path = require('path');
const fs = require('fs');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/error-handler');
const { setupExpressErrorHandler } = require('./instrument');
const userRoutes = require('./routes/users');
const teamRoutes = require('./routes/teams');
const authRoutes = require('./routes/auth');

require('express-async-errors');

const NON_SPA_PATH_PREFIXES = ['/api'];
const NON_SPA_ROUTES = new Set(['/health', '/debug-sentry']);

function shouldBypassSpaFallback(pathname) {
  return NON_SPA_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix)) || NON_SPA_ROUTES.has(pathname);
}

function createApp({ withSentry = false, serveFrontend = true } = {}) {
  const app = express();

  app.use(express.json());
  app.use(logger);

  const publicDir = path.join(__dirname, '..', 'public');
  const indexPath = path.join(publicDir, 'index.html');

  if (serveFrontend) {
    app.use(express.static(publicDir));
  }

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/users', userRoutes);
  app.use('/api/teams', teamRoutes);
  app.use('/api/auth', authRoutes);

  app.get('/debug-sentry', () => {
    throw new Error('My first Sentry error!');
  });

  if (serveFrontend && fs.existsSync(indexPath)) {
    app.get('*', (req, res, next) => {
      if (shouldBypassSpaFallback(req.path)) {
        return next();
      }

      return res.sendFile(indexPath);
    });
  }

  if (withSentry) {
    setupExpressErrorHandler(app);
  }

  app.use(errorHandler);

  return app;
}

module.exports = createApp;
