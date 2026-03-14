const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { sendCreated, sendNotFound, sendOk, withAsync } = require('../lib/http');
const { serializeUserProfile, serializeUserSummary } = require('../lib/serializers');

const router = express.Router();

// GET /api/users - List all users
router.get('/', withAsync(async (req, res) => {
  const users = await db.getAllUsers();
  sendOk(res, users);
}));

// GET /api/users/:id - Get user by ID
router.get('/:id', withAsync(async (req, res) => {
  const user = await db.findUser(req.params.id);

  if (!user) {
    return sendNotFound(res, 'User not found');
  }

  return sendOk(res, serializeUserSummary(user));
}));

// GET /api/users/:id/profile - Get user profile
router.get('/:id/profile', withAsync(async (req, res) => {
  const user = await db.findUser(req.params.id);

  if (!user) {
    return sendNotFound(res, 'User not found');
  }

  return sendOk(res, serializeUserProfile(user));
}));

// POST /api/users - Create user
router.post('/', validateRequired(['email', 'name']), validateEmail, withAsync(async (req, res) => {
  const { email, name, role } = req.body;
  const existing = await db.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  const user = await db.createUser({ email, name, role });
  return sendCreated(res, user);
}));

// PATCH /api/users/:id - Update user
router.patch('/:id', withAsync(async (req, res) => {
  const user = await db.updateUser(req.params.id, req.body);
  if (!user) {
    return sendNotFound(res, 'User not found');
  }
  return sendOk(res, user);
}));

// DELETE /api/users/:id - Soft delete (set status to inactive)
router.delete('/:id', withAsync(async (req, res) => {
  const user = await db.deleteUser(req.params.id);
  if (!user) {
    return sendNotFound(res, 'User not found');
  }
  return sendOk(res, { message: 'User deactivated', user });
}));

module.exports = router;
