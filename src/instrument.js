const Sentry = require("@sentry/node");
const config = require('./config');

if (config.sentryDsn) {
  Sentry.init({
    dsn: config.sentryDsn,
    sendDefaultPii: true,
    environment: config.env,
  });
}
