const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getMissingField(body, fields) {
  return fields.find((field) => !body[field]);
}

/**
 * Validates email format in request body
 */
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  if (!email || !EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  next();
};

/**
 * Factory function that returns middleware to check for required fields
 */
const validateRequired = (fields) => {
  return (req, res, next) => {
    const missingField = getMissingField(req.body, fields);
    if (missingField) {
      return res.status(400).json({ error: `Missing required field: ${missingField}` });
    }

    next();
  };
};

module.exports = { validateEmail, validateRequired };
