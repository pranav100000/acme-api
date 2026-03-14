const express = require('express');
const { validateEmail, validateRequired } = require('../middleware/validate');
const userService = require('../services/users');
const { asyncHandler } = require('../utils/errors');

const router = express.Router();

// GET /api/users - List all users
router.get('/', asyncHandler(async (req, res) => {
  res.json(await userService.listUsers());
}));

// GET /api/users/:id - Get user by ID
router.get('/:id', asyncHandler(async (req, res) => {
  res.json(await userService.getUserSummary(req.params.id));
}));

// GET /api/users/:id/profile - Get user profile
router.get('/:id/profile', asyncHandler(async (req, res) => {
  res.json(await userService.getUserProfile(req.params.id));
}));

// POST /api/users - Create user
router.post('/', validateRequired(['email', 'name']), validateEmail, asyncHandler(async (req, res) => {
  const { email, name, role } = req.body;
  const user = await userService.createUser({ email, name, role });
  res.status(201).json(user);
}));

// PATCH /api/users/:id - Update user
router.patch('/:id', asyncHandler(async (req, res) => {
  res.json(await userService.updateUser(req.params.id, req.body));
}));

// DELETE /api/users/:id - Soft delete (set status to inactive)
router.delete('/:id', asyncHandler(async (req, res) => {
  const user = await userService.deactivateUser(req.params.id);
  res.json({ message: 'User deactivated', user });
}));

module.exports = router;
