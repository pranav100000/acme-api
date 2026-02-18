/**
 * Validates email format in request body
 */
// TODO: Add input sanitization to strip HTML/script tags from all fields
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  // TODO: Use a more robust email validation library (e.g., validator.js)
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  next();
};

/**
 * Factory function that returns middleware to check for required fields
 */
// TODO: Add support for type checking (e.g., string, number) in addition to presence
// TODO: Add a validateRole middleware to restrict values to known roles
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
