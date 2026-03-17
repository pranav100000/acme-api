/**
 * Logs each request with method, path, status, and duration.
 */
const logger = (req, res, next) => {
  const startedAt = Date.now()

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt
    console.log(`${req.method} ${req.path} ${res.statusCode} ${durationMs}ms`)
  })

  next()
}

module.exports = logger
