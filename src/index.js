// IMPORTANT: Import instrument.js before all other imports
require("./instrument.js");

const Sentry = require("@sentry/node");
const express = require('express');
require('express-async-errors');
const config = require('./config');
const logger = require('./middleware/logger');
const userRoutes = require('./routes/users');
const teamRoutes = require('./routes/teams');
const authRoutes = require('./routes/auth');

const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(logger);

// Serve static frontend files in production
app.use(express.static(path.join(__dirname, '..', 'public')));

// TODO: Add rate limiting middleware to protect against abuse
// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/auth', authRoutes);

// Sentry test route
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// SPA fallback - serve index.html for non-API routes (only when build exists)
const indexPath = path.join(__dirname, '..', 'public', 'index.html');
if (fs.existsSync(indexPath)) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/debug-sentry')) {
      return next();
    }
    res.sendFile(indexPath);
  });
}

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

// Fallthrough error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
