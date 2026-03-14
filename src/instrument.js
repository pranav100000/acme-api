const Sentry = require('@sentry/node');

const config = require('./config');

let sentryInitialized = false;

function initSentry() {
  if (sentryInitialized || !config.sentryDsn) {
    return;
  }

  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.env,
    sendDefaultPii: true,
  });

  sentryInitialized = true;
}

function setupSentryErrorHandler(app) {
  if (!sentryInitialized) {
    return;
  }

  Sentry.setupExpressErrorHandler(app);
}

module.exports = { initSentry, setupSentryErrorHandler };
