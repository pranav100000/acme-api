/**
 * Request validation middleware.
 *
 * Provides reusable Express middleware for common input checks (email format,
 * required fields). Validation failures return a 400 JSON error response and
 * short-circuit the request pipeline.
 */

/**
 * Validates that `req.body.email` exists and matches a basic email pattern.
 * Returns 400 if the email is missing or malformed.
 */
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  next();
};

/**
 * Factory that returns middleware ensuring every field in `fields` is present
 * (truthy) in `req.body`. Returns 400 on the first missing field.
 *
 * @param {string[]} fields - List of required body field names.
 * @returns {Function} Express middleware
 *
 * @example
 *   router.post('/', validateRequired(['email', 'name']), handler);
 */
const validateRequired = (fields) => {
  return (req, res, next) => {
    for (const field of fields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    next();
  };
};

module.exports = { validateEmail, validateRequired };
