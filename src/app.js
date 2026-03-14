const express = require('express')
const path = require('path')
const fs = require('fs')
const Sentry = require('@sentry/node')
require('express-async-errors')

const logger = require('./middleware/logger')
const userRoutes = require('./routes/users')
const teamRoutes = require('./routes/teams')
const authRoutes = require('./routes/auth')

function createApp() {
  const app = express()

  app.use(express.json())
  app.use(logger)
  app.use(express.static(path.join(__dirname, '..', 'public')))

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api/users', userRoutes)
  app.use('/api/teams', teamRoutes)
  app.use('/api/auth', authRoutes)

  app.get('/debug-sentry', () => {
    throw new Error('My first Sentry error!')
  })

  registerSpaFallback(app)
  Sentry.setupExpressErrorHandler(app)
  app.use(errorHandler)

  return app
}

function registerSpaFallback(app) {
  const indexPath = path.join(__dirname, '..', 'public', 'index.html')

  if (!fs.existsSync(indexPath)) {
    return
  }

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health' || req.path === '/debug-sentry') {
      return next()
    }

    res.sendFile(indexPath)
  })
}

function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500

  if (status >= 500) {
    console.error(err.stack)
  }

  res.status(status).json({ error: err.message || 'Internal server error' })
}

module.exports = { createApp, errorHandler }
