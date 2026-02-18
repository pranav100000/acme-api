// TODO: Add configuration validation on startup (e.g., ensure required env vars are set)
// TODO: Add secrets management integration (e.g., AWS Secrets Manager, Vault)
// TODO: Add database connection configuration (host, port, credentials)
const config = {
  port: process.env.PORT || 3000,
  sentryDsn: process.env.SENTRY_DSN,
  env: process.env.NODE_ENV || 'development'
};

module.exports = config;
