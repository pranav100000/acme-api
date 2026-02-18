/**
 * User management routes.
 *
 * Provides CRUD endpoints for user records. Users are soft-deleted
 * (status set to "inactive") rather than permanently removed.
 */
const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');

const router = express.Router();

/** GET /api/users — List all users (no filtering or pagination). */
router.get('/', async (req, res) => {
  const users = await db.getAllUsers();
  res.json(users);
});

/**
 * GET /api/users/:id — Get a single user by ID.
 * Returns a subset of user fields (id, email, name, role).
 */
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

/**
 * GET /api/users/:id/profile — Get a display-friendly user profile.
 * Derives the user's initials from their full name.
 */
router.get('/:id/profile', async (req, res) => {
  const user = await db.findUser(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    displayName: user.name,
    email: user.email,
    // Build initials from the first letter of each name segment (e.g. "AC" for "Alice Chen")
    initials: user.name.split(' ').map(n => n[0]).join('')
  });
});

/**
 * POST /api/users — Create a new user.
 * Validates that email and name are present, email format is valid,
 * and the email is not already taken (409 Conflict).
 */
router.post('/', validateRequired(['email', 'name']), validateEmail, async (req, res) => {
  const { email, name, role } = req.body;
  // Check for duplicate email before inserting
  const existing = await db.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  const user = await db.createUser({ email, name, role });
  res.status(201).json(user);
});

/** PATCH /api/users/:id — Partially update user fields. */
router.patch('/:id', async (req, res) => {
  const user = await db.updateUser(req.params.id, req.body);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

/**
 * DELETE /api/users/:id — Soft-delete a user.
 * Sets the user's status to "inactive" rather than removing the record.
 */
router.delete('/:id', async (req, res) => {
  const user = await db.deleteUser(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ message: 'User deactivated', user });
});

module.exports = router;
