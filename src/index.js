require('./instrument');

const config = require('./config');
const { createApp } = require('./app');

const app = createApp();

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

module.exports = app;
