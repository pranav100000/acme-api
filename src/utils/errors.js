class HttpError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
  }
}

class NotFoundError extends HttpError {
  constructor(message = 'Not found') {
    super(message, 404)
  }
}

class ValidationError extends HttpError {
  constructor(message = 'Validation failed', statusCode = 400) {
    super(message, statusCode)
  }
}

/**
 * Wraps an async route handler to catch errors and forward to Express error handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = {
  HttpError,
  NotFoundError,
  ValidationError,
  asyncHandler,
}
