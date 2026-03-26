const express = require('express');

function createTestApp(mount, router) {
  const app = express();
  app.use(express.json());
  app.use(mount, router);
  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Internal server error' });
  });
  return app;
}

function startServer(app) {
  const server = app.listen(0);
  const { port } = server.address();
  return { server, baseUrl: `http://localhost:${port}` };
}

module.exports = { createTestApp, startServer };
