const { ValidationError } = require("../utils/errors");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (req, _res, next) => {
	const { email } = req.body;
	if (!email || !EMAIL_PATTERN.test(email)) {
		return next(new ValidationError("Invalid email format"));
	}
	next();
};

const validateRequired = (fields) => {
	return (req, _res, next) => {
		for (const field of fields) {
			if (!req.body[field]) {
				return next(new ValidationError(`Missing required field: ${field}`));
			}
		}
		next();
	};
};

module.exports = { validateEmail, validateRequired };
