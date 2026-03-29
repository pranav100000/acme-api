const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { serializePublicUser, serializeUserProfile } = require('../serializers/users');
const { asyncHandler, ConflictError, NotFoundError } = require('../utils/errors');

const router = express.Router();

// GET /api/users - List all users
router.get('/', asyncHandler(async (req, res) => {
  const users = await db.getAllUsers();
  res.json(users);
}));

// GET /api/users/:id - Get user by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await db.findUser(req.params.id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json(serializePublicUser(user));
}));

// GET /api/users/:id/profile - Get user profile
router.get('/:id/profile', asyncHandler(async (req, res) => {
  const user = await db.findUser(req.params.id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json(serializeUserProfile(user));
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
