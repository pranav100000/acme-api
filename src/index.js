const config = require('./config');
const { initSentry } = require('./instrument');
const createApp = require('./app');

initSentry({ dsn: config.sentryDsn, env: config.env });

const app = createApp({ withSentry: Boolean(config.sentryDsn) });
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
