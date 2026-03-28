const db = require('../db');
const { NotFoundError, ConflictError } = require('../utils/errors');

async function getAll() {
  return db.getAllUsers();
}

async function getById(id) {
  const user = await db.findUser(id);
  if (!user) throw new NotFoundError('User not found');
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

async function getProfile(id) {
  const user = await db.findUser(id);
  if (!user) throw new NotFoundError('User not found');
  return {
    displayName: user.name,
    email: user.email,
    initials: user.name.split(' ').map(n => n[0]).join('')
  };
}

async function create({ email, name, role }) {
  const existing = await db.findUserByEmail(email);
  if (existing) throw new ConflictError('Email already exists');
  return db.createUser({ email, name, role });
}

async function update(id, updates) {
  const user = await db.updateUser(id, updates);
  if (!user) throw new NotFoundError('User not found');
  return user;
}

async function remove(id) {
  const user = await db.deleteUser(id);
  if (!user) throw new NotFoundError('User not found');
  return user;
}

module.exports = { getAll, getById, getProfile, create, update, remove };
