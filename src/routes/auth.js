const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');

const router = express.Router();

// POST /api/auth/login
// TODO: Add password-based authentication instead of email-only login
// TODO: Return a JWT or session token instead of the full user object
// TODO: Add brute-force protection (account lockout after failed attempts)
router.post('/login', validateRequired(['email']), validateEmail, async (req, res) => {
  const user = await db.findUserByEmail(req.body.email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', user });
});

// POST /api/auth/logout
// TODO: Invalidate the user's session or JWT token on logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
