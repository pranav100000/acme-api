const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { conflict, created, notFound } = require('../utils/http');
const { getInitials } = require('../utils/name');

const router = express.Router();

// GET /api/users - List all users
router.get('/', async (req, res) => {
  const users = await db.getAllUsers();
  res.json(users);
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  const user = await db.findUser(req.params.id);

  if (!user) {
    throw notFound('User not found');
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });
});

// GET /api/users/:id/profile - Get user profile
router.get('/:id/profile', async (req, res) => {
  const user = await db.findUser(req.params.id);

  if (!user) {
    throw notFound('User not found');
  }

  res.json({
    displayName: user.name,
    email: user.email,
    initials: getInitials(user.name)
  });
});

// POST /api/users - Create user
router.post('/', validateRequired(['email', 'name']), validateEmail, async (req, res) => {
  const { email, name, role } = req.body;
  const existing = await db.findUserByEmail(email);
  if (existing) {
    throw conflict('Email already exists');
  }
  const user = await db.createUser({ email, name, role });
  return created(res, user);
});

// PATCH /api/users/:id - Update user
router.patch('/:id', async (req, res) => {
  const user = await db.updateUser(req.params.id, req.body);
  if (!user) {
    throw notFound('User not found');
  }
  res.json(user);
});

// DELETE /api/users/:id - Soft delete (set status to inactive)
router.delete('/:id', async (req, res) => {
  const user = await db.deleteUser(req.params.id);
  if (!user) {
    throw notFound('User not found');
  }
  res.json({ message: 'User deactivated', user });
});

module.exports = router;
