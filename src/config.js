/**
 * Application configuration.
 * Values are read from environment variables with sensible defaults for local development.
 */
const config = {
  /** HTTP port the Express server listens on */
  port: process.env.PORT || 3000,

  /** Sentry DSN for error tracking (undefined disables Sentry) */
  sentryDsn: process.env.SENTRY_DSN,

  /** Current environment: 'development', 'test', or 'production' */
  env: process.env.NODE_ENV || 'development'
};

module.exports = config;
