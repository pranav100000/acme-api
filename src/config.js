// Application configuration with environment variable overrides
const config = {
  port: process.env.PORT || 3000,
  sentryDsn: process.env.SENTRY_DSN,
  env: process.env.NODE_ENV || 'development'
};

// Export config for use across all server modules
module.exports = config;
