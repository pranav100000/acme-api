const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { HttpError } = require('../utils/http');

const router = express.Router();

// POST /api/auth/login
router.post('/login', validateRequired(['email']), validateEmail, async (req, res) => {
  const user = await db.findUserByEmail(req.body.email);
  if (!user) {
    throw new HttpError(401, 'Invalid credentials');
  }
  res.json({ message: 'Login successful', user });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
