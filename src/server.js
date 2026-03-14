const { createApp } = require('./app');
const config = require('./config');
const { initSentry, setupSentryErrorHandler } = require('./instrument');

function startServer() {
  initSentry();

  const app = createApp();
  setupSentryErrorHandler(app);

  const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });

  return { app, server };
}

module.exports = { startServer };
