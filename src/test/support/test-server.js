async function startTestServer(app) {
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });

  const { port } = server.address();

  return {
    server,
    baseUrl: `http://localhost:${port}`,
    async close() {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }
  };
}

module.exports = { startTestServer };
