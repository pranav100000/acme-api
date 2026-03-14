const { ValidationError } = require('../utils/errors')

function validateEmail(req, res, next) {
  const { email } = req.body

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return next(new ValidationError('Invalid email format'))
  }

  next()
}

function validateRequired(fields) {
  return (req, res, next) => {
    const missingField = fields.find(field => !req.body[field])

    if (missingField) {
      return next(new ValidationError(`Missing required field: ${missingField}`))
    }

    next()
  }
}

module.exports = { validateEmail, validateRequired }
