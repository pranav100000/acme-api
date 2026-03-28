const express = require('express');
const db = require('../db');

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

async function startTestServer(basePath, router) {
  db._reset();
  const app = createTestApp(basePath, router);
  const server = app.listen(0);
  const { port } = server.address();

  return {
    baseUrl: `http://localhost:${port}`,
    close: async () => {
      await new Promise((resolve) => server.close(resolve));
      db._reset();
    },
  };
}

module.exports = {
  createTestApp,
  startTestServer,
};
