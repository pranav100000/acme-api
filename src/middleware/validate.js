/**
 * Request-validation middleware.
 *
 * These are reusable Express middleware functions that validate incoming
 * request bodies and short-circuit with a 400 response on failure.
 */

/**
 * Validates that `req.body.email` exists and matches a basic email pattern.
 * Returns 400 with an error message if validation fails.
 */
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  // Simple regex: <local>@<domain>.<tld> — not RFC-5322 complete,
  // but sufficient for this demo application.
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  next();
};

/**
 * Factory function that creates middleware to enforce required body fields.
 *
 * @param {string[]} fields - List of field names that must be present and truthy.
 * @returns {Function} Express middleware that responds 400 if any field is missing.
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
