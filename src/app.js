const fs = require('fs');
const path = require('path');
const express = require('express');
require('express-async-errors');
const Sentry = require('@sentry/node');

const logger = require('./middleware/logger');
const userRoutes = require('./routes/users');
const teamRoutes = require('./routes/teams');
const authRoutes = require('./routes/auth');

function createApp(options = {}) {
  const {
    useLogger = true,
    serveStatic = true,
  } = options;

  const app = express();
  const publicDir = path.join(__dirname, '..', 'public');
  const indexPath = path.join(publicDir, 'index.html');

  app.use(express.json());

  if (useLogger) {
    app.use(logger);
  }

  if (serveStatic) {
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

  if (serveStatic && fs.existsSync(indexPath)) {
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/debug-sentry')) {
        return next();
      }

      return res.sendFile(indexPath);
    });
  }

  Sentry.setupExpressErrorHandler(app);

  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    if (statusCode >= 500) {
      console.error(err.stack);
    }

    res.status(statusCode).json({ error: err.message || 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
