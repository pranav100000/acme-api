/**
 * @module instrument
 * @description Sentry error tracking initialization.
 * Must be imported before all other modules to ensure proper instrumentation.
 */

const Sentry = require("@sentry/node");

/**
 * Initialize Sentry SDK for error tracking and performance monitoring.
 * @see https://docs.sentry.io/platforms/javascript/guides/node/
 */
Sentry.init({
  dsn: "https://df3678b7bd8489203bc70fc932bdbb22@o4510703250505728.ingest.us.sentry.io/4510854705053696",
  sendDefaultPii: true,
});
