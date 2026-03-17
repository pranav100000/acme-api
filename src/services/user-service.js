const db = require('../db');
const { NotFoundError, ValidationError } = require('../utils/errors');

async function listUsers() {
  return db.getAllUsers();
}

async function getUserOrThrow(id) {
  const user = await db.findUser(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
}

async function getUserSummary(id) {
  const user = await getUserOrThrow(id);
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

async function getUserProfile(id) {
  const user = await getUserOrThrow(id);
  return {
    displayName: user.name,
    email: user.email,
    initials: user.name
      .split(' ')
      .map((part) => part[0])
      .join(''),
  };
}

async function createUser({ email, name, role }) {
  const existing = await db.findUserByEmail(email);
  if (existing) {
    throw new ValidationError('Email already exists');
  }

  return db.createUser({ email, name, role });
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
    user,
  };
}

module.exports = {
  listUsers,
  getUserSummary,
  getUserProfile,
  createUser,
  updateUser,
  deactivateUser,
};
