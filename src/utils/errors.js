class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
  }
}

class NotFoundError extends HttpError {
  constructor(message = 'Not found') {
    super(404, message);
  }
}

class ValidationError extends HttpError {
  constructor(message = 'Validation failed') {
    super(400, message);
  }
}

class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

class ConflictError extends HttpError {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const assertFound = (value, message = 'Not found') => {
  if (!value) {
    throw new NotFoundError(message);
  }

  return value;
};

module.exports = {
  HttpError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ConflictError,
  asyncHandler,
  assertFound,
};
