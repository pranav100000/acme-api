// IMPORTANT: Import instrument.js before all other imports
require('./instrument.js');

const Sentry = require('@sentry/node');
const express = require('express');
require('express-async-errors');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const logger = require('./middleware/logger');
const userRoutes = require('./routes/users');
const teamRoutes = require('./routes/teams');
const authRoutes = require('./routes/auth');

const STATIC_DIR = path.join(__dirname, '..', 'public');
const SPA_ENTRYPOINT = path.join(STATIC_DIR, 'index.html');
const NON_SPA_PREFIXES = ['/api', '/health', '/debug-sentry'];

function isSpaRequest(requestPath) {
  return !NON_SPA_PREFIXES.some((prefix) => requestPath.startsWith(prefix));
}

function registerSpaFallback(app) {
  if (!fs.existsSync(SPA_ENTRYPOINT)) {
    return;
  }

  app.get('*', (req, res, next) => {
    if (!isSpaRequest(req.path)) {
      return next();
    }

    return res.sendFile(SPA_ENTRYPOINT);
  });
}

function registerErrorHandlers(app) {
  Sentry.setupExpressErrorHandler(app);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Internal server error' });
  });
}

function buildApp() {
  const app = express();

  app.use(express.json());
  app.use(logger);
  app.use(express.static(STATIC_DIR));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/users', userRoutes);
  app.use('/api/teams', teamRoutes);
  app.use('/api/auth', authRoutes);

  app.get('/debug-sentry', () => {
    throw new Error('My first Sentry error!');
  });

  registerSpaFallback(app);
  registerErrorHandlers(app);

  return app;
}

function startServer(port = config.port) {
  const app = buildApp();

  return app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { buildApp, startServer };
