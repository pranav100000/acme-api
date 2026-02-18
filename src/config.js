/**
 * Application configuration.
 * Values are read from environment variables with sensible defaults
 * for local development. In production, set these via your hosting
 * platform's environment / secrets manager.
 */
const config = {
  port: process.env.PORT || 3000,           // HTTP port the server listens on
  sentryDsn: process.env.SENTRY_DSN,        // Sentry DSN for error tracking (optional in dev)
  env: process.env.NODE_ENV || 'development' // "development" | "production" | "test"
};

module.exports = config;
