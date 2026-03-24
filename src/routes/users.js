const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { NotFoundError, ConflictError, asyncHandler } = require('../utils/errors');

const router = express.Router();

const toUserSummary = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role
});

const toUserProfile = (user) => ({
  displayName: user.name,
  email: user.email,
  initials: user.name.split(' ').map((namePart) => namePart[0]).join('')
});

const findUserOrThrow = async (id) => {
  const user = await db.findUser(id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

// GET /api/users - List all users
router.get('/', asyncHandler(async (req, res) => {
  const users = await db.getAllUsers();
  res.json(users);
}));

// GET /api/users/:id - Get user by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await findUserOrThrow(req.params.id);
  res.json(toUserSummary(user));
}));

// GET /api/users/:id/profile - Get user profile
router.get('/:id/profile', asyncHandler(async (req, res) => {
  const user = await findUserOrThrow(req.params.id);
  res.json(toUserProfile(user));
}));

// POST /api/users - Create user
router.post('/', validateRequired(['email', 'name']), validateEmail, asyncHandler(async (req, res) => {
  const { email, name, role } = req.body;
  const existing = await db.findUserByEmail(email);

  if (existing) {
    throw new ConflictError('Email already exists');
  }

  const user = await db.createUser({ email, name, role });
  res.status(201).json(user);
}));

// PATCH /api/users/:id - Update user
router.patch('/:id', asyncHandler(async (req, res) => {
  const user = await db.updateUser(req.params.id, req.body);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json(user);
}));

// DELETE /api/users/:id - Soft delete (set status to inactive)
router.delete('/:id', asyncHandler(async (req, res) => {
  const user = await db.deleteUser(req.params.id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json({ message: 'User deactivated', user });
}));

module.exports = router;
