/**
 * Custom error classes for the application.
 *
 * Each error carries a `statusCode` property so the global error handler in
 * index.js can automatically send the correct HTTP status without a switch/case.
 */

/** Throw when a requested resource (user, team, etc.) does not exist. */
class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

/** Throw when user-supplied input fails validation rules. */
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
