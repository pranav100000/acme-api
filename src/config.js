// Application configuration - loads settings from environment variables with sensible defaults
const config = {
  port: process.env.PORT || 3000,
  sentryDsn: process.env.SENTRY_DSN,
  env: process.env.NODE_ENV || 'development'
};

module.exports = config;
