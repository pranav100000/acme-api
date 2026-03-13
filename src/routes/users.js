const express = require('express');
const db = require('../db');
const { ValidationError, asyncHandler } = require('../utils/errors');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { ensureFound } = require('../utils/respond');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const users = await db.getAllUsers();
    res.json(users);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const user = ensureFound(await db.findUser(req.params.id), 'User not found');

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  })
);

router.get(
  '/:id/profile',
  asyncHandler(async (req, res) => {
    const user = ensureFound(await db.findUser(req.params.id), 'User not found');

    res.json({
      displayName: user.name,
      email: user.email,
      initials: user.name.split(' ').map((name) => name[0]).join(''),
    });
  })
);

router.post(
  '/',
  validateRequired(['email', 'name']),
  validateEmail,
  asyncHandler(async (req, res) => {
    const { email, name, role } = req.body;
    const existing = await db.findUserByEmail(email);

    if (existing) {
      throw new ValidationError('Email already exists');
    }

    const user = await db.createUser({ email, name, role });
    res.status(201).json(user);
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const user = ensureFound(await db.updateUser(req.params.id, req.body), 'User not found');
    res.json(user);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const user = ensureFound(await db.deleteUser(req.params.id), 'User not found');
    res.json({ message: 'User deactivated', user });
  })
);

module.exports = router;
