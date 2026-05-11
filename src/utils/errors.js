class AppError extends Error {
	constructor(message = "Application error", statusCode = 500) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
	}
}

class NotFoundError extends AppError {
	constructor(message = "Not found") {
		super(message, 404);
	}
}

class ValidationError extends AppError {
	constructor(message = "Validation failed") {
		super(message, 400);
	}
}

class ConflictError extends AppError {
	constructor(message = "Conflict") {
		super(message, 409);
	}
}

class UnauthorizedError extends AppError {
	constructor(message = "Unauthorized") {
		super(message, 401);
	}
}

const asyncHandler = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
	AppError,
	NotFoundError,
	ValidationError,
	ConflictError,
	UnauthorizedError,
	asyncHandler,
};
