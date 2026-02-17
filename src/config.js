/**
 * Application configuration.
 * Centralizes environment variables and default values used throughout the server.
 */
const config = {
  /** HTTP port the Express server listens on */
  port: process.env.PORT || 3000,

  /** Sentry DSN for error tracking (optional, disabled when absent) */
  sentryDsn: process.env.SENTRY_DSN,

  /** Current runtime environment: 'development', 'test', or 'production' */
  env: process.env.NODE_ENV || 'development'
};

module.exports = config;
