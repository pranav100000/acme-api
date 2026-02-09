const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');

const router = express.Router();

// POST /api/auth/login
router.post('/login', validateRequired(['email']), validateEmail, async (req, res) => {
  const user = await db.findUserByEmail(req.body.email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', user });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
