const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');

const router = express.Router();

// GET /api/users - List all users (with optional filtering)
router.get('/', async (req, res) => {
  let users = await db.getAllUsers();
  const { status, role, search } = req.query;

  if (status) {
    users = users.filter(u => u.status === status);
  }
  if (role) {
    users = users.filter(u => u.role === role);
  }
  if (search) {
    const term = search.toLowerCase();
    users = users.filter(u =>
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  }

  res.json(users);
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  const user = await db.findUser(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
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
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    displayName: user.name,
    email: user.email,
    initials: user.name.split(' ').map(n => n[0]).join('')
  });
});

// POST /api/users - Create user
router.post('/', validateRequired(['email', 'name']), validateEmail, async (req, res) => {
  const { email, name, role } = req.body;
  const existing = await db.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  const user = await db.createUser({ email, name, role });
  res.status(201).json(user);
});

// PATCH /api/users/:id - Update user
router.patch('/:id', async (req, res) => {
  const user = await db.updateUser(req.params.id, req.body);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// DELETE /api/users/:id - Soft delete (set status to inactive)
router.delete('/:id', async (req, res) => {
  const user = await db.deleteUser(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ message: 'User deactivated', user });
});

module.exports = router;
