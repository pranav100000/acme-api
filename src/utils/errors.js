/**
 * Custom error classes and utilities for consistent API error responses.
 *
 * Each custom error carries a `statusCode` property that the global error
 * handler in index.js uses to set the HTTP response status.
 */

/** Thrown when a requested resource (user, team, etc.) does not exist. */
class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

/** Thrown when request data fails validation (missing fields, bad format, etc.). */
class ValidationError extends Error {
  constructor(message = 'Validation failed') {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

/**
 * Wraps an async route handler so that rejected promises are automatically
 * forwarded to Express's `next(err)` error-handling pipeline.
 *
 * Note: the `express-async-errors` package already does this globally, so this
 * helper is provided as a belt-and-suspenders utility for explicit use.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { NotFoundError, ValidationError, asyncHandler };
