const { asyncHandler } = require('../utils/errors')

function notFound(res, message) {
  return res.status(404).json({ error: message })
}

function createLookup(loadEntity, message) {
  return async (id, res) => {
    const entity = await loadEntity(id)

    if (!entity) {
      notFound(res, message)
      return null
    }

    return entity
  }
}

module.exports = { asyncHandler, notFound, createLookup }
