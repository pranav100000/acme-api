// IMPORTANT: Import instrument.js before all other imports so Sentry can
// monkey-patch modules (e.g. http, express) before they are loaded.
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

app.use(express.json()); // Parse JSON request bodies
app.use(logger); // Log every incoming request (method, path, timestamp)

// Serve the built frontend assets (CSS, JS, images) from the /public directory
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

// SPA fallback — for any non-API GET request, serve index.html so that
// client-side routing (React Router) can handle the path. Only enabled
// when a production build exists in /public.
const indexPath = path.join(__dirname, '..', 'public', 'index.html');
if (fs.existsSync(indexPath)) {
  app.get('*', (req, res, next) => {
    // Skip API, health-check, and debug routes so they hit their own handlers
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/debug-sentry')) {
      return next();
    }
    res.sendFile(indexPath);
  });
}

// Sentry's error handler must be registered after all controllers but before
// our own error middleware so it can capture exceptions first.
Sentry.setupExpressErrorHandler(app);

// Global fallthrough error handler — returns a JSON error response.
// Custom errors (e.g. NotFoundError) carry their own statusCode; everything
// else defaults to 500.
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
