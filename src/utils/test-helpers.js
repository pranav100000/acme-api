const express = require('express');

/**
 * Creates a configured Express app for testing with the given routes.
 * Includes JSON body parsing and a standard error handler.
 *
 * @param {string} mountPath - URL path to mount routes on (e.g. '/api/users')
 * @param {import('express').Router} router - Express router to mount
 * @returns {import('express').Express} Configured Express app
 */
function createTestApp(mountPath, router) {
  const app = express();
  app.use(express.json());
  app.use(mountPath, router);
  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Internal server error' });
  });
  return app;
}

/**
 * Starts a test server on a random port and returns the base URL.
 * Returns an object with baseUrl and a close function for cleanup.
 *
 * @param {import('express').Express} app - Express app to start
 * @returns {Promise<{ baseUrl: string, server: import('http').Server }>}
 */
function startTestServer(app) {
  const server = app.listen(0);
  const { port } = server.address();
  return { baseUrl: `http://localhost:${port}`, server };
}

module.exports = { createTestApp, startTestServer };
