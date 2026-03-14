// IMPORTANT: Import instrument.js before all other imports
require('./instrument.js');

require('express-async-errors');
const config = require('./config');
const createApp = require('./app');

const app = createApp();

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

module.exports = app;
