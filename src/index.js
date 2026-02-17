/**
 * Express server entry point.
 * Wires up middleware, API routes, static file serving, and error handling.
 */

// IMPORTANT: Import instrument.js before all other imports
// Sentry must patch modules before they are required elsewhere
require("./instrument.js");

const Sentry = require("@sentry/node");
const express = require('express');
require('express-async-errors'); // Automatically catches async errors in route handlers
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

// Serve the built frontend assets from /public (created by `vite build`)
app.use(express.static(path.join(__dirname, '..', 'public')));

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

// SPA fallback — return index.html for any non-API GET request so
// client-side routing (React Router) works on hard refresh / direct navigation
const indexPath = path.join(__dirname, '..', 'public', 'index.html');
if (fs.existsSync(indexPath)) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/debug-sentry')) {
      return next();
    }
    res.sendFile(indexPath);
  });
}

// Sentry’s error handler must come after all controllers but before our own error middleware
Sentry.setupExpressErrorHandler(app);

// Final catch-all error handler — formats errors as JSON with appropriate status codes
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
