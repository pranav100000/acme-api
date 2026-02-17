/**
 * User management routes.
 * Mounted at /api/users — provides CRUD operations for user accounts.
 */
const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');

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
// Returns a lightweight profile view with display name and computed initials
router.get('/:id/profile', async (req, res) => {
  const user = await db.findUser(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    displayName: user.name,
    email: user.email,
    initials: user.name.split(' ').map(n => n[0]).join('') // e.g. "Alice Chen" -> "AC"
  });
});

// POST /api/users - Create user
// Validates required fields and email format, then checks for duplicate emails
router.post('/', validateRequired(['email', 'name']), validateEmail, async (req, res) => {
  const { email, name, role } = req.body;

  // Prevent duplicate email addresses (409 Conflict)
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

// DELETE /api/users/:id - Soft delete (sets status to 'inactive' rather than removing the record)
router.delete('/:id', async (req, res) => {
  const user = await db.deleteUser(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ message: 'User deactivated', user });
});

module.exports = router;
