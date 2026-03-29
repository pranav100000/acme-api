class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

class NotFoundError extends HttpError {
  constructor(message = 'Not found') {
    super(message, 404);
  }
}

class ValidationError extends HttpError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ConflictError extends HttpError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

/**
 * Wraps an async route handler to catch errors and forward to Express error handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  HttpError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ConflictError,
  asyncHandler,
};
