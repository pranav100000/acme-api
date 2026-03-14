const express = require('express');

const logger = require('../../middleware/logger');
const { errorHandler, notFoundHandler } = require('../../middleware/error-handler');

function createTestApp(basePath, router) {
  const app = express();

  app.use(express.json());
  app.use(logger);
  app.use(basePath, router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createTestApp };
