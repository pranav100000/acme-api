/**
 * Sentry instrumentation — must be imported before any other module
 * so that Sentry can patch Node.js built-ins (http, etc.) and the
 * Express framework for automatic error & performance tracking.
 */
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://df3678b7bd8489203bc70fc932bdbb22@o4510703250505728.ingest.us.sentry.io/4510854705053696",
  // Include user context (IP, cookies, etc.) in error reports
  sendDefaultPii: true,
});
