const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { NotFoundError } = require('../utils/errors');

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await db.getAllUsers();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await db.findUser(req.params.id);
  if (!user) throw new NotFoundError('User not found');

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });
});

router.get('/:id/profile', async (req, res) => {
  const user = await db.findUser(req.params.id);
  if (!user) throw new NotFoundError('User not found');

  res.json({
    displayName: user.name,
    email: user.email,
    initials: user.name.split(' ').map(n => n[0]).join('')
  });
});

router.post('/', validateRequired(['email', 'name']), validateEmail, async (req, res) => {
  const { email, name, role } = req.body;
  const existing = await db.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  const user = await db.createUser({ email, name, role });
  res.status(201).json(user);
});

router.patch('/:id', async (req, res) => {
  const user = await db.updateUser(req.params.id, req.body);
  if (!user) throw new NotFoundError('User not found');

  res.json(user);
});

router.delete('/:id', async (req, res) => {
  const user = await db.deleteUser(req.params.id);
  if (!user) throw new NotFoundError('User not found');

  res.json({ message: 'User deactivated', user });
});

module.exports = router;
