const Sentry = require('@sentry/node');

let initialized = false;

function initSentry({ dsn = process.env.SENTRY_DSN, env = process.env.NODE_ENV || 'development' } = {}) {
  if (initialized || !dsn) {
    return;
  }

  Sentry.init({
    dsn,
    environment: env,
    sendDefaultPii: true,
  });

  initialized = true;
}

function setupExpressErrorHandler(app) {
  if (!initialized) {
    return;
  }

  Sentry.setupExpressErrorHandler(app);
}

module.exports = {
  initSentry,
  setupExpressErrorHandler,
};
