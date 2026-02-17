/**
 * Middleware: validates that `req.body.email` is present and matches
 * a basic email pattern (local@domain.tld). Returns 400 on failure.
 *
 * Regex breakdown: one-or-more non-whitespace/@ chars, '@', domain, '.', TLD
 */
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  next();
};

/**
 * Factory function that returns middleware to check for required fields.
 *
 * @param {string[]} fields - List of field names that must be present (and truthy) in req.body.
 * @returns {Function} Express middleware that returns 400 if any field is missing.
 *
 * Usage: router.post('/', validateRequired(['email', 'name']), handler)
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
