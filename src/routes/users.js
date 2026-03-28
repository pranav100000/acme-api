const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { asyncHandler, assertFound, ConflictError } = require('../utils/errors');
const { toUserSummary, toUserProfile } = require('../serializers/users');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const users = await db.getAllUsers();
  res.json(users);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const user = assertFound(await db.findUser(req.params.id), 'User not found');
  res.json(toUserSummary(user));
}));

router.get('/:id/profile', asyncHandler(async (req, res) => {
  const user = assertFound(await db.findUser(req.params.id), 'User not found');
  res.json(toUserProfile(user));
}));

router.post('/', validateRequired(['email', 'name']), validateEmail, asyncHandler(async (req, res) => {
  const { email, name, role } = req.body;
  const existing = await db.findUserByEmail(email);

  if (existing) {
    throw new ConflictError('Email already exists');
  }

  const user = await db.createUser({ email, name, role });
  res.status(201).json(user);
}));

router.patch('/:id', asyncHandler(async (req, res) => {
  const user = assertFound(await db.updateUser(req.params.id, req.body), 'User not found');
  res.json(user);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const user = assertFound(await db.deleteUser(req.params.id), 'User not found');
  res.json({ message: 'User deactivated', user });
}));

module.exports = router;
