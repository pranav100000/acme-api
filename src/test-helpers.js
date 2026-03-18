const createApp = require('./index');
const db = require('./db');

async function createTestServer() {
  db._reset();

  const app = createApp();
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });

  const { port } = server.address();

  return {
    baseUrl: `http://localhost:${port}`,
    close: async () => {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
      db._reset();
    }
  };
}

module.exports = {
  createTestServer
};
