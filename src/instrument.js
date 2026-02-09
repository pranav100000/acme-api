const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://df3678b7bd8489203bc70fc932bdbb22@o4510703250505728.ingest.us.sentry.io/4510854705053696",
  sendDefaultPii: true,
});
