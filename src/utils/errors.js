class HttpError extends Error {
  constructor(message, statusCode, name = 'HttpError') {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

class NotFoundError extends HttpError {
  constructor(message = 'Not found') {
    super(message, 404, 'NotFoundError');
  }
}

class ValidationError extends HttpError {
  constructor(message = 'Validation failed') {
    super(message, 400, 'ValidationError');
  }
}

class ConflictError extends HttpError {
  constructor(message = 'Conflict') {
    super(message, 409, 'ConflictError');
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

function assertFound(value, message) {
  if (!value) {
    throw new NotFoundError(message);
  }
  return value;
}

module.exports = {
  ConflictError,
  HttpError,
  NotFoundError,
  ValidationError,
  asyncHandler,
  assertFound,
};
