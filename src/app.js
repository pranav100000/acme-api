const express = require('express');
const path = require('path');
const fs = require('fs');
const Sentry = require('@sentry/node');
const logger = require('./middleware/logger');
const userRoutes = require('./routes/users');
const teamRoutes = require('./routes/teams');
const authRoutes = require('./routes/auth');

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(logger);
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/users', userRoutes);
  app.use('/api/teams', teamRoutes);
  app.use('/api/auth', authRoutes);

  app.get('/debug-sentry', function debugSentryRoute() {
    throw new Error('My first Sentry error!');
  });

  const indexPath = path.join(__dirname, '..', 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    app.get('*', (req, res, next) => {
      if (['/api', '/health', '/debug-sentry'].some((prefix) => req.path.startsWith(prefix))) {
        return next();
      }
      res.sendFile(indexPath);
    });
  }

  Sentry.setupExpressErrorHandler(app);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Internal server error' });
  });

  return app;
}

module.exports = createApp;
