const express = require('express')
const { errorHandler } = require('../app')

function createRouteTestApp(basePath, router) {
  const app = express()
  app.use(express.json())
  app.use(basePath, router)
  app.use(errorHandler)
  return app
}

module.exports = { createRouteTestApp }
