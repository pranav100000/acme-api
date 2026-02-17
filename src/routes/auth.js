/**
 * Authentication routes.
 * Mounted at /api/auth — handles login and logout.
 * Note: This is a simplified auth flow (email-only, no password) for demo purposes.
 */
const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');

const router = express.Router();

// POST /api/auth/login
// Looks up the user by email; returns 401 if no matching account exists.
// No password check — this is a demo/prototype authentication flow.
router.post('/login', validateRequired(['email']), validateEmail, async (req, res) => {
  const user = await db.findUserByEmail(req.body.email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', user });
});

// POST /api/auth/logout
// Stateless logout — the client is responsible for clearing its stored session.
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
