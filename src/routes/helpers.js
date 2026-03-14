const { asyncHandler } = require('../utils/errors')

function notFound(res, message) {
  return res.status(404).json({ error: message })
}

module.exports = { asyncHandler, notFound }
