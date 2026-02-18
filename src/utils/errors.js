/**
 * Custom error classes and helpers for consistent HTTP error responses.
 *
 * Each error class sets a `statusCode` property that the global error
 * handler in index.js uses to determine the HTTP response status.
 */

/**
 * Thrown when a requested resource (user, team, etc.) does not exist.
 * Results in a 404 HTTP response.
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
 * Results in a 400 HTTP response.
 */
class ValidationError extends Error {
  constructor(message = 'Validation failed') {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

/**
 * Wraps an async route handler to catch rejected promises and forward
 * them to the Express error-handling middleware via `next(err)`.
 *
 * Note: the `express-async-errors` package already does this globally,
 * but this helper is available for explicit use where needed.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { NotFoundError, ValidationError, asyncHandler };
