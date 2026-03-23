const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { ConflictError, asyncHandler, assertFound } = require('../utils/errors');

const router = express.Router();

async function loadUser(id, message = 'User not found') {
  return assertFound(await db.findUser(id), message);
}

router.get('/', asyncHandler(async (req, res) => {
  res.json(await db.getAllUsers());
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const { id, email, name, role } = await loadUser(req.params.id);
  res.json({ id, email, name, role });
}));

router.get('/:id/profile', asyncHandler(async (req, res) => {
  const user = await loadUser(req.params.id);
  res.json({
    displayName: user.name,
    email: user.email,
    initials: user.name.split(' ').map((part) => part[0]).join(''),
  });
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
