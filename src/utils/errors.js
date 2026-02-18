// TODO: Add more specific error types (e.g., UnauthorizedError, ForbiddenError, ConflictError)
// TODO: Add error codes in addition to messages for programmatic error handling
class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

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
