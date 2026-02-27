const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const config = require('../config');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * Generates a JWT token for a user
 * @param {Object} user - User object (without password)
 * @returns {string} JWT token
 */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

// POST /api/auth/login
router.post('/login', validateRequired(['email', 'password']), validateEmail, async (req, res) => {
  const { email, password } = req.body;

  const user = await db.findUserWithPassword(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const { password: _, ...safeUser } = user;
  const token = generateToken(safeUser);

  res.json({ message: 'Login successful', token, user: safeUser });
});

// POST /api/auth/register
router.post('/register', validateRequired(['email', 'name', 'password']), validateEmail, async (req, res) => {
  const { email, name, role, password } = req.body;

  const existing = await db.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const user = await db.createUser({ email, name, role, password });
  const token = generateToken(user);

  res.status(201).json({ message: 'Registration successful', token, user });
});

// GET /api/auth/me - Get current authenticated user
router.get('/me', authenticate, async (req, res) => {
  const user = await db.findUser(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
