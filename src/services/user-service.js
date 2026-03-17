const db = require('../db')
const { NotFoundError, ValidationError } = require('../utils/errors')

async function listUsers() {
  return db.getAllUsers()
}

async function getUser(id) {
  const user = await db.findUser(id)
  if (!user) {
    throw new NotFoundError('User not found')
  }
  return user
}

async function createUser({ email, name, role }) {
  const existingUser = await db.findUserByEmail(email)
  if (existingUser) {
    throw new ValidationError('Email already exists', 409)
  }

  return db.createUser({ email, name, role })
}

async function updateUser(id, updates) {
  const user = await db.updateUser(id, updates)
  if (!user) {
    throw new NotFoundError('User not found')
  }
  return user
}

async function deactivateUser(id) {
  const user = await db.deleteUser(id)
  if (!user) {
    throw new NotFoundError('User not found')
  }
  return user
}

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deactivateUser,
}
