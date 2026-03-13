const db = require('../db');
const { NotFoundError, ValidationError } = require('../utils/errors');

async function requireUser(id) {
  const user = await db.findUser(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
}

function toUserSummary(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
}

function toUserProfile(user) {
  return {
    displayName: user.name,
    email: user.email,
    initials: user.name.split(' ').map((part) => part[0]).join('')
  };
}

async function listUsers() {
  return db.getAllUsers();
}

async function getUserSummary(id) {
  const user = await requireUser(id);
  return toUserSummary(user);
}

async function getUserProfile(id) {
  const user = await requireUser(id);
  return toUserProfile(user);
}

async function createUser(payload) {
  const existing = await db.findUserByEmail(payload.email);
  if (existing) {
    throw new ValidationError('Email already exists');
  }

  return db.createUser(payload);
}

async function updateUser(id, updates) {
  const user = await db.updateUser(id, updates);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
}

async function deactivateUser(id) {
  const user = await db.deleteUser(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return {
    message: 'User deactivated',
    user
  };
}

module.exports = {
  createUser,
  deactivateUser,
  getUserProfile,
  getUserSummary,
  listUsers,
  updateUser
};
