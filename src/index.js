/**
 * Acme Corp API — Main application entry point.
 *
 * Sets up the Express server, mounts middleware and route handlers,
 * configures static-file serving for the React frontend, and wires
 * up Sentry for error tracking.
 */

// IMPORTANT: Import instrument.js before all other imports so that
// Sentry can monkey-patch modules (http, express, etc.) early.
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

// --- Global Middleware ---
app.use(express.json());  // Parse incoming JSON request bodies
app.use(logger);          // Log every request (method, path, timestamp)

// Serve the pre-built React frontend from the /public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- Route Mounting ---

/** Simple health-check endpoint used by monitoring and the frontend status indicator. */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/users', userRoutes);  // CRUD operations for user records
app.use('/api/teams', teamRoutes);  // CRUD operations for teams & membership
app.use('/api/auth', authRoutes);   // Fake authentication (email-only login)

// Intentional error route — useful for verifying Sentry integration
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// SPA fallback — serve index.html for any non-API route so that
// client-side routing (React Router) works on page refresh.
// Only enabled when a production build exists in /public.
const indexPath = path.join(__dirname, '..', 'public', 'index.html');
if (fs.existsSync(indexPath)) {
  app.get('*', (req, res, next) => {
    // Skip API and utility routes — let them 404 normally
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/debug-sentry')) {
      return next();
    }
    res.sendFile(indexPath);
  });
}

// Sentry's error handler must be registered after all controllers but
// before our own error-handling middleware so it can capture exceptions.
Sentry.setupExpressErrorHandler(app);

/**
 * Global fallthrough error handler.
 * Catches any error thrown or forwarded by route handlers and returns
 * a consistent JSON error response. Custom error classes (e.g. NotFoundError)
 * can set `statusCode` to control the HTTP status.
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

// Start listening for incoming requests
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the app instance for testing
module.exports = app;
