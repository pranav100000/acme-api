const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { asyncHandler, NotFoundError } = require('../utils/errors');
const { requireUser, toUserProfile, toUserSummary } = require('./helpers');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const users = await db.getAllUsers();
  res.json(users);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const user = await requireUser(req.params.id);
  res.json(toUserSummary(user));
}));

router.get('/:id/profile', asyncHandler(async (req, res) => {
  const user = await requireUser(req.params.id);
  res.json(toUserProfile(user));
}));

router.post('/', validateRequired(['email', 'name']), validateEmail, asyncHandler(async (req, res) => {
  const { email, name, role } = req.body;
  const existing = await db.findUserByEmail(email);

  if (existing) {
    const error = new Error('Email already exists');
    error.statusCode = 409;
    throw error;
  }

  const user = await db.createUser({ email, name, role });
  res.status(201).json(user);
}));

router.patch('/:id', asyncHandler(async (req, res) => {
  const user = await db.updateUser(req.params.id, req.body);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  res.json(user);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const user = await db.deleteUser(req.params.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  res.json({ message: 'User deactivated', user });
}));

module.exports = router;
