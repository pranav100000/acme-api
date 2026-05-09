/**
 * Validates email format in request body
 */
const validateEmail = (req, res, next) => {
	const { email } = req.body;
	if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return res.status(400).json({ error: "Invalid email format" });
	}
	next();
};

/**
 * Factory function that returns middleware to check for required fields
 */
const validateRequired = (fields) => {
	return (req, res, next) => {
		for (const field of fields) {
			if (!req.body[field]) {
				return res
					.status(400)
					.json({ error: `Missing required field: ${field}` });
			}
		}
		next();
	};
};

/**
 * Validates email format in request body when email is provided
 */
const validateOptionalEmail = (req, res, next) => {
	const { email } = req.body;
	if (email === undefined) {
		return next();
	}
	if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return res.status(400).json({ error: "Invalid email format" });
	}
	next();
};

/**
 * Factory function that validates provided values against an allow-list
 */
const validateAllowedValues = (field, allowedValues) => {
	return (req, res, next) => {
		const value = req.body[field];
		if (value === undefined) {
			return next();
		}
		if (!allowedValues.includes(value)) {
			return res.status(400).json({
				error: `Invalid ${field}. Allowed values: ${allowedValues.join(", ")}`,
			});
		}
		next();
	};
};

module.exports = {
	validateEmail,
	validateOptionalEmail,
	validateRequired,
	validateAllowedValues,
};
