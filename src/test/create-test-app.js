const express = require('express');

const errorHandler = require('../middleware/error-handler');

function createTestApp(basePath, router) {
  const app = express();

  app.use(express.json());
  app.use(basePath, router);
  app.use(errorHandler);

  return app;
}

module.exports = createTestApp;
