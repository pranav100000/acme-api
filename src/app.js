const Sentry = require('@sentry/node');
const express = require('express');
const fs = require('fs');
const path = require('path');

const logger = require('./middleware/logger');
const authRoutes = require('./routes/auth');
const { errorHandler } = require('./middleware/error-handler');
const teamRoutes = require('./routes/teams');
const userRoutes = require('./routes/users');

function createApp() {
  const app = express();
  const publicDir = path.join(__dirname, '..', 'public');
  const indexPath = path.join(publicDir, 'index.html');

  app.use(express.json());
  app.use(logger);
  app.use(express.static(publicDir));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/users', userRoutes);
  app.use('/api/teams', teamRoutes);
  app.use('/api/auth', authRoutes);

  app.get('/debug-sentry', () => {
    throw new Error('My first Sentry error!');
  });

  if (fs.existsSync(indexPath)) {
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path === '/health' || req.path === '/debug-sentry') {
        return next();
      }
      return res.sendFile(indexPath);
    });
  }

  Sentry.setupExpressErrorHandler(app);

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
