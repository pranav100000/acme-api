const Sentry = require("@sentry/node");
const config = require("./config");

Sentry.init({
  dsn: config.sentryDsn,
  sendDefaultPii: true,
});
