/**
 * Custom error classes for consistent HTTP error responses.
 * Each error carries a `statusCode` so the global error handler can
 * set the correct HTTP status without switch/case logic.
 */

/**
 * Thrown when a requested resource (user, team, etc.) does not exist.
 * Maps to HTTP 404.
 */
class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

/**
 * Thrown when request data fails validation (missing fields, bad format, etc.).
 * Maps to HTTP 400.
 */
class ValidationError extends Error {
  constructor(message = 'Validation failed') {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

/**
 * Wraps an async route handler to catch errors and forward to Express error handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { NotFoundError, ValidationError, asyncHandler };
