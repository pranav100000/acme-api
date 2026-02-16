/**
 * Express server entry point.
 * Wires up middleware, API routes, static file serving, Sentry error
 * tracking, and the SPA fallback for client-side routing.
 */

// IMPORTANT: Sentry instrumentation must be loaded before all other imports
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

// Serve the pre-built frontend assets (output of `npm run build` → public/)
app.use(express.static(path.join(__dirname, '..', 'public')));

// ── API routes ──────────────────────────────────────────────────────

/** Lightweight health-check endpoint for uptime monitors */
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

// SPA fallback — serve index.html for any non-API GET request so that
// client-side routing (React Router) works on page refresh
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

// Global error handler — catches anything thrown or forwarded via next(err)
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
