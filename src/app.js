const fs = require('fs');
const path = require('path');
const express = require('express');
const Sentry = require('@sentry/node');
require('express-async-errors');

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/error-handler');
const userRoutes = require('./routes/users');
const teamRoutes = require('./routes/teams');
const authRoutes = require('./routes/auth');

function registerStaticFrontend(app) {
  const publicDir = path.join(__dirname, '..', 'public');
  const indexPath = path.join(publicDir, 'index.html');

  app.use(express.static(publicDir));

  if (!fs.existsSync(indexPath)) {
    return;
  }

  app.get('*', (req, res, next) => {
    if (
      req.path.startsWith('/api') ||
      req.path.startsWith('/health') ||
      req.path.startsWith('/debug-sentry')
    ) {
      return next();
    }

    return res.sendFile(indexPath);
  });
}

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(logger);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/users', userRoutes);
  app.use('/api/teams', teamRoutes);
  app.use('/api/auth', authRoutes);

  app.get('/debug-sentry', () => {
    throw new Error('My first Sentry error!');
  });

  registerStaticFrontend(app);

  Sentry.setupExpressErrorHandler(app);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp, registerStaticFrontend };
