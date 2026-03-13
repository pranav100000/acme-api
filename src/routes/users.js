const express = require('express')

const db = require('../db')
const { validateEmail, validateRequired } = require('../middleware/validate')
const { asyncHandler } = require('../utils/errors')

const router = express.Router()

function sendUserSummary(res, user) {
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
}

function sendUserProfile(res, user) {
  res.json({
    displayName: user.name,
    email: user.email,
    initials: user.name
      .split(' ')
      .map((part) => part[0])
      .join(''),
  })
}

router.get('/', asyncHandler(async (req, res) => {
  const users = await db.getAllUsers()
  res.json(users)
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const user = await db.findUser(req.params.id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  sendUserSummary(res, user)
}))

router.get('/:id/profile', asyncHandler(async (req, res) => {
  const user = await db.findUser(req.params.id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  sendUserProfile(res, user)
}))

router.post('/', validateRequired(['email', 'name']), validateEmail, asyncHandler(async (req, res) => {
  const { email, name, role } = req.body
  const existingUser = await db.findUserByEmail(email)
  if (existingUser) {
    return res.status(409).json({ error: 'Email already exists' })
  }

  const user = await db.createUser({ email, name, role })
  res.status(201).json(user)
}))

router.patch('/:id', asyncHandler(async (req, res) => {
  const user = await db.updateUser(req.params.id, req.body)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json(user)
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  const user = await db.deleteUser(req.params.id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json({ message: 'User deactivated', user })
}))

module.exports = router
