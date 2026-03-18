// IMPORTANT: Import instrument.js before all other imports
require("./instrument.js");

const Sentry = require("@sentry/node");
const express = require('express');
const config = require('./config');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/error-handler');
const createUsersRouter = require('./routes/users');
const createTeamsRouter = require('./routes/teams');
const createAuthRouter = require('./routes/auth');

const path = require('path');
const fs = require('fs');

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(logger);
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/users', createUsersRouter());
  app.use('/api/teams', createTeamsRouter());
  app.use('/api/auth', createAuthRouter());

  app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });

  const indexPath = path.join(__dirname, '..', 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/debug-sentry')) {
        return next();
      }
      res.sendFile(indexPath);
    });
  }

  if (config.sentryDsn) {
    Sentry.setupExpressErrorHandler(app);
  }

  app.use(errorHandler);

  return app;
}

if (require.main === module) {
  const PORT = config.port;
  createApp().listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = createApp;
