const db = require('../db');
const { ConflictError, NotFoundError } = require('../utils/errors');

async function listUsers() {
  return db.getAllUsers();
}

async function getUserSummary(id) {
  const user = await db.findUser(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
}

async function getUserProfile(id) {
  const user = await db.findUser(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return {
    displayName: user.name,
    email: user.email,
    initials: user.name.split(' ').map((namePart) => namePart[0]).join('')
  };
}

async function createUser(userInput) {
  const existingUser = await db.findUserByEmail(userInput.email);
  if (existingUser) {
    throw new ConflictError('Email already exists');
  }

  return db.createUser(userInput);
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
