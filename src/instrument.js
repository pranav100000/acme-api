const Sentry = require('@sentry/node');
const config = require('./config');

let initialized = false;

function initInstrumentation() {
  if (initialized || !config.sentryDsn) {
    return;
  }

  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.env,
    sendDefaultPii: true,
  });

  initialized = true;
}

initInstrumentation();

module.exports = { initInstrumentation };
