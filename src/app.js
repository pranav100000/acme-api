const express = require('express');
const path = require('path');

const { registerRoutes } = require('./routes');
const logger = require('./middleware/logger');
const { notFoundHandler, errorHandler } = require('./middleware/error-handler');

function createApp({ publicDir = path.join(__dirname, '..', 'public') } = {}) {
  const app = express();

  app.locals.publicDir = publicDir;

  app.use(express.json());
  app.use(logger);
  app.use(express.static(publicDir));

  registerRoutes(app, { publicDir });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
