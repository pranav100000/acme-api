/**
 * @module middleware/validate
 * @description Express validation middleware for request body fields.
 */

/**
 * Validates that the request body contains a properly formatted email address.
 * Responds with 400 if the email is missing or invalid.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  next();
};

/**
 * Factory function that returns middleware to check for required fields in the request body.
 * Responds with 400 if any of the specified fields are missing or falsy.
 * @param {string[]} fields - Array of required field names
 * @returns {import('express').RequestHandler} Express middleware that validates required fields
 * @example
 * router.post('/', validateRequired(['email', 'name']), handler);
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
