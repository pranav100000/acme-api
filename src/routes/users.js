const express = require('express');
const { validateEmail, validateRequired } = require('../middleware/validate');
const usersService = require('../services/users-service');
const { asyncHandler } = require('../utils/errors');

const router = express.Router();

// GET /api/users - List all users
router.get('/', asyncHandler(async (req, res) => {
  const users = await usersService.listUsers();
  res.json(users);
}));

// GET /api/users/:id - Get user by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await usersService.getUserSummary(req.params.id);
  res.json(user);
}));

// GET /api/users/:id/profile - Get user profile
router.get('/:id/profile', asyncHandler(async (req, res) => {
  const profile = await usersService.getUserProfile(req.params.id);
  res.json(profile);
}));

// POST /api/users - Create user
router.post('/', validateRequired(['email', 'name']), validateEmail, asyncHandler(async (req, res) => {
  const user = await usersService.createUser(req.body);
  res.status(201).json(user);
}));

// PATCH /api/users/:id - Update user
router.patch('/:id', asyncHandler(async (req, res) => {
  const user = await usersService.updateUser(req.params.id, req.body);
  res.json(user);
}));

// DELETE /api/users/:id - Soft delete (set status to inactive)
router.delete('/:id', asyncHandler(async (req, res) => {
  const result = await usersService.deactivateUser(req.params.id);
  res.json(result);
}));

module.exports = router;
