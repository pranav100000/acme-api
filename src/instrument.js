const Sentry = require('@sentry/node')
const config = require('./config')

if (config.sentryDsn) {
  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.env,
    sendDefaultPii: true,
  })
}
