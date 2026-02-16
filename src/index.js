/**
 * Application entry point.
 *
 * Sets up the Express server with middleware, API routes, static file serving,
 * SPA fallback, Sentry error handling, and a global error handler.
 */

// IMPORTANT: Import instrument.js before all other imports so Sentry can
// monkey-patch modules and capture errors from the very start.
require("./instrument.js");

const Sentry = require("@sentry/node");
const express = require('express');
require('express-async-errors'); // Allows async route handlers to throw without explicit try/catch
const config = require('./config');
const logger = require('./middleware/logger');
const userRoutes = require('./routes/users');
const teamRoutes = require('./routes/teams');
const authRoutes = require('./routes/auth');

const path = require('path');
const fs = require('fs');

const app = express();

// --- Middleware ----------------------------------------------------------------
app.use(express.json());  // Parse incoming JSON request bodies
app.use(logger);          // Log every request (method, path, timestamp)

// Serve the pre-built frontend assets from the /public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- Routes -------------------------------------------------------------------

// Simple health-check endpoint used by monitoring and the frontend dashboard
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mount REST API routers
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/auth', authRoutes);

// Intentionally throws to verify Sentry integration is working
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// SPA fallback — serve index.html for any non-API GET request so that
// client-side routing (React Router) works on page refresh / deep links.
const indexPath = path.join(__dirname, '..', 'public', 'index.html');
if (fs.existsSync(indexPath)) {
  app.get('*', (req, res, next) => {
    // Skip API and utility routes — they should be handled above
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/debug-sentry')) {
      return next();
    }
    res.sendFile(indexPath);
  });
}

// --- Error handling -----------------------------------------------------------

// Sentry's error handler must be registered after all controllers but before
// our own error middleware so it can capture unhandled exceptions.
Sentry.setupExpressErrorHandler(app);

// Global fallthrough error handler — returns a JSON error response.
// Custom errors (e.g. NotFoundError, ValidationError) carry their own statusCode.
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

// --- Start server -------------------------------------------------------------
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
