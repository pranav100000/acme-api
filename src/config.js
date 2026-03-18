const config = {
  // Default to port 3000 for local development.
  port: process.env.PORT || 3000,
  sentryDsn: process.env.SENTRY_DSN,
  env: process.env.NODE_ENV || 'development'
};

module.exports = config;
