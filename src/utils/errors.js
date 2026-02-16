/**
 * Custom error classes for consistent API error responses.
 * Each error carries a `statusCode` property so the global error handler
 * can translate it into the correct HTTP status.
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
 * Wraps an async route handler to catch errors and forward to Express error handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { NotFoundError, ValidationError, asyncHandler };
