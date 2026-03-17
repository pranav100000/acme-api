const { createApp } = require('../app');

function createTestApp() {
  return createApp({
    useLogger: false,
    serveStatic: false,
  });
}

module.exports = { createTestApp };
