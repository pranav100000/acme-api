const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  sentryDsn: process.env.SENTRY_DSN || null,
  isProduction: (process.env.NODE_ENV || 'development') === 'production'
};

module.exports = config;
