const db = require('../db');
const { NotFoundError } = require('../utils/errors');

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('');
}

async function requireUser(id) {
  const user = await db.findUser(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
}

async function requireTeam(id) {
  const team = await db.findTeam(id);
  if (!team) {
    throw new NotFoundError('Team not found');
  }
  return team;
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
