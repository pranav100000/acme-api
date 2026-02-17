/**
 * Application entry point.
 * Sets up the Express server with middleware, API routes, static file serving,
 * SPA fallback, Sentry error tracking, and a global error handler.
 */

// IMPORTANT: Import instrument.js before all other imports so Sentry can
// monkey-patch modules and capture performance/error data from the start.
require("./instrument.js");

const Sentry = require("@sentry/node");
const express = require('express');
require('express-async-errors'); // Automatically forwards async errors to Express error handlers
const config = require('./config');
const logger = require('./middleware/logger');
const userRoutes = require('./routes/users');
const teamRoutes = require('./routes/teams');
const authRoutes = require('./routes/auth');

const path = require('path');
const fs = require('fs');

const app = express();

// --- Core Middleware ---
app.use(express.json()); // Parse JSON request bodies
app.use(logger);         // Log every incoming request

// Serve the pre-built frontend assets (CSS, JS, images) from /public
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- API Routes ---

// Simple health-check endpoint used by the frontend Dashboard to show API status
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

// SPA fallback — serve index.html for any non-API route so client-side
// routing (React Router) works on page refresh. Only enabled when the
// production build exists on disk.
const indexPath = path.join(__dirname, '..', 'public', 'index.html');
if (fs.existsSync(indexPath)) {
  app.get('*', (req, res, next) => {
    // Skip API and special routes so they still return JSON / errors
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/debug-sentry')) {
      return next();
    }
    res.sendFile(indexPath);
  });
}

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

// Global fallthrough error handler — catches anything not handled above.
// Uses `err.statusCode` from custom error classes (NotFoundError, ValidationError)
// or defaults to 500 for unexpected errors.
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
