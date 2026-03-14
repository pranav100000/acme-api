const db = require('../db');
const { ConflictError, NotFoundError } = require('../utils/errors');

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
    initials: user.name
      .split(' ')
      .map((namePart) => namePart[0])
      .join(''),
  };
}

async function listUsers() {
  return db.getAllUsers();
}

async function getUser(id) {
  const user = await db.findUser(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
}

async function getUserSummary(id) {
  return toUserSummary(await getUser(id));
}

async function getUserProfile(id) {
  return toUserProfile(await getUser(id));
}

async function createUser(payload) {
  const existingUser = await db.findUserByEmail(payload.email);
  if (existingUser) {
    throw new ConflictError('Email already exists');
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
  return user;
}

module.exports = {
  listUsers,
  getUserSummary,
  getUserProfile,
  createUser,
  updateUser,
  deactivateUser,
};
