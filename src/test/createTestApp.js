const express = require('express');

function createTestApp(basePath, router) {
  const app = express();
  app.use(express.json());
  app.use(basePath, router);
  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Internal server error' });
  });

  return app;
}

module.exports = { createTestApp };
