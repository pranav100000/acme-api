const express = require('express');

/**
 * Creates a test Express app with JSON parsing and error handling.
 * @param {string} path - The route path prefix (e.g. '/api/users')
 * @param {import('express').Router} router - The Express router to mount
 * @returns {import('express').Express}
 */
function createTestApp(path, router) {
  const app = express();
  app.use(express.json());
  app.use(path, router);
  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Internal server error' });
  });
  return app;
}

module.exports = { createTestApp };
