const db = require('../db');
const { NotFoundError } = require('../utils/errors');

async function requireEntity(loader, message) {
  const entity = await loader();
  if (!entity) {
    throw new NotFoundError(message);
  }
  return entity;
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('');
}

async function requireUser(id) {
  return requireEntity(() => db.findUser(id), 'User not found');
}

async function requireTeam(id) {
  return requireEntity(() => db.findTeam(id), 'Team not found');
}

function toUserSummary(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

function toUserProfile(user) {
  return {
    displayName: user.name,
    email: user.email,
    initials: getInitials(user.name),
  };
}

module.exports = {
  requireTeam,
  requireUser,
  toUserProfile,
  toUserSummary,
};
