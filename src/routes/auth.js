/**
 * Authentication routes — handles login and logout.
 * This is a simplified email-only auth flow (no passwords) for demo purposes.
 * All routes are mounted under /api/auth in index.js.
 */
const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');

const router = express.Router();

// POST /api/auth/login
// Looks up the user by email; returns 401 if no matching account exists.
router.post('/login', validateRequired(['email']), validateEmail, async (req, res) => {
  const user = await db.findUserByEmail(req.body.email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', user });
});

// POST /api/auth/logout
// Stateless logout — the client is responsible for clearing its own session data.
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
