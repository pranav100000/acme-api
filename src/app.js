// IMPORTANT: Import instrument.js before all other imports
require('./instrument.js');

const express = require('express');
const path = require('path');
const fs = require('fs');
const Sentry = require('@sentry/node');

const logger = require('./middleware/logger');
const errorHandler = require('./middleware/error-handler');
const authRoutes = require('./routes/auth');
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

      res.sendFile(indexPath);
    });
  }

  Sentry.setupExpressErrorHandler(app);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
