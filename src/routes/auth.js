/**
 * Authentication routes.
 *
 * Mounted at /api/auth — provides a simplified email-only login flow.
 * There is no password or token management; the login endpoint simply
 * looks up the user by email and returns the user object on success.
 */
const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');

const router = express.Router();

// POST /api/auth/login
// Validates the email, then looks up the user. Returns 401 if no match is found.
router.post('/login', validateRequired(['email']), validateEmail, async (req, res) => {
  const user = await db.findUserByEmail(req.body.email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', user });
});

// POST /api/auth/logout
// Stateless logout — the server has no session to destroy, so this is a no-op
// that returns a success message for the client to act on.
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
