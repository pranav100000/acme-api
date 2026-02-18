/**
 * Authentication routes.
 *
 * This is a simplified (fake) auth implementation for demo purposes.
 * Login checks only that the email belongs to an existing user —
 * there is no password verification or session/token management.
 */
const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticate a user by email address.
 * Validates the email format, then checks if a matching user exists.
 * Returns the full user object on success (used by the frontend to
 * populate AuthContext).
 */
router.post('/login', validateRequired(['email']), validateEmail, async (req, res) => {
  const user = await db.findUserByEmail(req.body.email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', user });
});

/**
 * POST /api/auth/logout
 * Placeholder logout endpoint — always returns success.
 * In a real app this would invalidate the session or revoke tokens.
 */
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
