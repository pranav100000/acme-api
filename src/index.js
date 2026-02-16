// IMPORTANT: Import instrument.js before all other imports so Sentry can
// monkey-patch modules (http, express, etc.) before they are loaded.
require("./instrument.js");

const Sentry = require("@sentry/node");
const express = require('express');
require('express-async-errors'); // Lets Express catch rejected promises in async route handlers
const config = require('./config');
const logger = require('./middleware/logger');
const userRoutes = require('./routes/users');
const teamRoutes = require('./routes/teams');
const authRoutes = require('./routes/auth');

const path = require('path');
const fs = require('fs');

const app = express();

// --- Global middleware ---
app.use(express.json());  // Parse JSON request bodies
app.use(logger);          // Log every incoming request

// Serve the pre-built frontend assets (created by `npm run build`)
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- API Routes ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/users', userRoutes);  // CRUD operations for users
app.use('/api/teams', teamRoutes);  // CRUD operations for teams
app.use('/api/auth', authRoutes);   // Login / logout

// Sentry test route
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// SPA fallback — for any non-API GET request, serve the React app's index.html
// so that client-side routing (react-router) can handle the path.
const indexPath = path.join(__dirname, '..', 'public', 'index.html');
if (fs.existsSync(indexPath)) {
  app.get('*', (req, res, next) => {
    // Skip API, health-check, and debug routes — let them 404 normally
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/debug-sentry')) {
      return next();
    }
    res.sendFile(indexPath);
  });
}

// Sentry's error handler must be registered after all controllers but
// *before* our own error middleware so it can capture exceptions first.
Sentry.setupExpressErrorHandler(app);

// Global fallthrough error handler — formats errors as JSON responses
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
