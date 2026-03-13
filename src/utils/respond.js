const { NotFoundError } = require('./errors');

function ensureFound(entity, message) {
  if (!entity) {
    throw new NotFoundError(message);
  }

  return entity;
}

module.exports = { ensureFound };
