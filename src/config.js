/**
 * @module config
 * @description Application configuration loaded from environment variables with sensible defaults.
 */

/**
 * @typedef {Object} AppConfig
 * @property {number|string} port - The port the server listens on (default: 3000)
 * @property {string|undefined} sentryDsn - Sentry DSN for error tracking
 * @property {string} env - Current environment: 'development', 'production', or 'test'
 */

/** @type {AppConfig} */
const config = {
  port: process.env.PORT || 3000,
  sentryDsn: process.env.SENTRY_DSN,
  env: process.env.NODE_ENV || 'development'
};

module.exports = config;
