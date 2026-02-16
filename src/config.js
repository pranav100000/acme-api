/**
 * Application configuration.
 * Values are read from environment variables with sensible defaults for local development.
 */
const config = {
  /** HTTP port the Express server listens on */
  port: process.env.PORT || 3000,

  /** Sentry DSN for error reporting (optional — disabled when unset) */
  sentryDsn: process.env.SENTRY_DSN,

  /** Current runtime environment: 'development', 'test', or 'production' */
  env: process.env.NODE_ENV || 'development'
};

module.exports = config;
