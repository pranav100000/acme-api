// IMPORTANT: Import instrument.js before all other imports
require("./instrument.js");

const config = require('./config');
const { createApp } = require('./app');

const app = createApp();
const PORT = config.port;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
