/**
 * @module routes/users
 * @description User management routes for CRUD operations and profile access.
 */

const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');

const router = express.Router();

/**
 * GET /api/users
 * Retrieves a list of all users.
 * @route GET /api/users
 * @returns {Array<User>} 200 - Array of all user objects
 */
router.get('/', async (req, res) => {
  const users = await db.getAllUsers();
  res.json(users);
});

/**
 * GET /api/users/:id
 * Retrieves a single user by their ID (limited fields: id, email, name, role).
 * @route GET /api/users/:id
 * @param {string} req.params.id - User ID
 * @returns {Object} 200 - Partial user object: { id, email, name, role }
 * @returns {Object} 404 - User not found: { error: string }
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
 * GET /api/users/:id/profile
 * Retrieves a user's display profile including computed initials.
 * @route GET /api/users/:id/profile
 * @param {string} req.params.id - User ID
 * @returns {Object} 200 - User profile: { displayName, email, initials }
 * @returns {Object} 404 - User not found: { error: string }
 */
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

/**
 * POST /api/users
 * Creates a new user. Rejects duplicate email addresses.
 * @route POST /api/users
 * @param {string} req.body.email - The new user's email address
 * @param {string} req.body.name - The new user's full name
 * @param {string} [req.body.role='developer'] - The new user's role
 * @returns {User} 201 - The newly created user object
 * @returns {Object} 400 - Missing/invalid fields: { error: string }
 * @returns {Object} 409 - Email already exists: { error: string }
 */
router.post('/', validateRequired(['email', 'name']), validateEmail, async (req, res) => {
  const { email, name, role } = req.body;
  const existing = await db.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  const user = await db.createUser({ email, name, role });
  res.status(201).json(user);
});

/**
 * PATCH /api/users/:id
 * Updates an existing user's details (email, name, role, status).
 * @route PATCH /api/users/:id
 * @param {string} req.params.id - User ID
 * @param {Object} req.body - Fields to update
 * @returns {User} 200 - The updated user object
 * @returns {Object} 404 - User not found: { error: string }
 */
router.patch('/:id', async (req, res) => {
  const user = await db.updateUser(req.params.id, req.body);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

/**
 * DELETE /api/users/:id
 * Soft-deletes a user by setting their status to 'inactive'.
 * @route DELETE /api/users/:id
 * @param {string} req.params.id - User ID
 * @returns {Object} 200 - Deactivation confirmation: { message: string, user: User }
 * @returns {Object} 404 - User not found: { error: string }
 */
router.delete('/:id', async (req, res) => {
  const user = await db.deleteUser(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ message: 'User deactivated', user });
});

module.exports = router;
