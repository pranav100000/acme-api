const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { route, sendNotFound } = require('./helpers');

const router = express.Router();

// GET /api/users - List all users
router.get('/', route(async (req, res) => {
  const users = await db.getAllUsers();
  res.json(users);
}));

// GET /api/users/:id - Get user by ID
router.get('/:id', route(async (req, res) => {
  const user = await db.findUser(req.params.id);

  if (!user) {
    return sendNotFound(res, 'User');
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });
}));

// GET /api/users/:id/profile - Get user profile
router.get('/:id/profile', route(async (req, res) => {
  const user = await db.findUser(req.params.id);

  if (!user) {
    return sendNotFound(res, 'User');
  }

  res.json({
    displayName: user.name,
    email: user.email,
    initials: user.name.split(' ').map((n) => n[0]).join('')
  });
}));

// POST /api/users - Create user
router.post('/', validateRequired(['email', 'name']), validateEmail, route(async (req, res) => {
  const { email, name, role } = req.body;
  const existing = await db.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  const user = await db.createUser({ email, name, role });
  res.status(201).json(user);
}));

// PATCH /api/users/:id - Update user
router.patch('/:id', route(async (req, res) => {
  const user = await db.updateUser(req.params.id, req.body);
  if (!user) {
    return sendNotFound(res, 'User');
  }
  res.json(user);
}));

// DELETE /api/users/:id - Soft delete (set status to inactive)
router.delete('/:id', route(async (req, res) => {
  const user = await db.deleteUser(req.params.id);
  if (!user) {
    return sendNotFound(res, 'User');
  }
  res.json({ message: 'User deactivated', user });
}));

module.exports = router;
