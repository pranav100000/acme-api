const express = require('express');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { asyncHandler } = require('../utils/errors');
const userService = require('../services/userService');

const router = express.Router();

// GET /api/users - List all users
router.get('/', asyncHandler(async (req, res) => {
  const users = await userService.getAll();
  res.json(users);
}));

// GET /api/users/:id - Get user by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id);
  res.json(user);
}));

// GET /api/users/:id/profile - Get user profile
router.get('/:id/profile', asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.params.id);
  res.json(profile);
}));

// POST /api/users - Create user
router.post('/', validateRequired(['email', 'name']), validateEmail, asyncHandler(async (req, res) => {
  const { email, name, role } = req.body;
  const user = await userService.create({ email, name, role });
  res.status(201).json(user);
}));

// PATCH /api/users/:id - Update user
router.patch('/:id', asyncHandler(async (req, res) => {
  const user = await userService.update(req.params.id, req.body);
  res.json(user);
}));

// DELETE /api/users/:id - Soft delete (set status to inactive)
router.delete('/:id', asyncHandler(async (req, res) => {
  const user = await userService.remove(req.params.id);
  res.json({ message: 'User deactivated', user });
}));

module.exports = router;
