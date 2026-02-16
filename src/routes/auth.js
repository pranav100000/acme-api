/**
 * Authentication routes.
 *
 * This is a simplified auth flow — login is email-only (no password) and
 * there is no server-side session. The client stores the returned user
 * object in localStorage to maintain the "logged in" state.
 */

const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');

const router = express.Router();

// POST /api/auth/login
// Validates that a user with the given email exists, then returns the user object.
router.post('/login', validateRequired(['email']), validateEmail, async (req, res) => {
  const user = await db.findUserByEmail(req.body.email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', user });
});

// POST /api/auth/logout
// No server-side session to destroy — this is a no-op acknowledgment.
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
