const express = require('express')

function createTestApp(routePath, router) {
  const app = express()
  app.use(express.json())
  app.use(routePath, router)
  app.use((err, req, res, next) => {
    const status = err.statusCode || 500
    res.status(status).json({ error: err.message || 'Internal server error' })
  })
  return app
}

async function startTestServer(routePath, router) {
  const app = createTestApp(routePath, router)
  const server = app.listen(0)
  const { port } = server.address()

  return {
    app,
    server,
    baseUrl: `http://localhost:${port}`,
  }
}

module.exports = {
  createTestApp,
  startTestServer,
}
