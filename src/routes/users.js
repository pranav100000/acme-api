const express = require('express')
const { validateEmail, validateRequired } = require('../middleware/validate')
const userService = require('../services/user-service')
const { asyncHandler } = require('../utils/errors')

const router = express.Router()

// GET /api/users - List all users
router.get('/', asyncHandler(async (req, res) => {
  const users = await userService.listUsers()
  res.json(users)
}))

// GET /api/users/:id - Get user by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await userService.getUser(req.params.id)

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
}))

// GET /api/users/:id/profile - Get user profile
router.get('/:id/profile', asyncHandler(async (req, res) => {
  const user = await userService.getUser(req.params.id)

  res.json({
    displayName: user.name,
    email: user.email,
    initials: user.name.split(' ').map((namePart) => namePart[0]).join(''),
  })
}))

// POST /api/users - Create user
router.post('/', validateRequired(['email', 'name']), validateEmail, asyncHandler(async (req, res) => {
  const { email, name, role } = req.body
  const user = await userService.createUser({ email, name, role })
  res.status(201).json(user)
}))

// PATCH /api/users/:id - Update user
router.patch('/:id', asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body)
  res.json(user)
}))

// DELETE /api/users/:id - Soft delete (set status to inactive)
router.delete('/:id', asyncHandler(async (req, res) => {
  const user = await userService.deactivateUser(req.params.id)
  res.json({ message: 'User deactivated', user })
}))

module.exports = router
