const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { UnauthorizedError, asyncHandler } = require('../utils/errors');

const router = express.Router();

// POST /api/auth/login
router.post('/login', validateRequired(['email']), validateEmail, asyncHandler(async (req, res) => {
  const user = await db.findUserByEmail(req.body.email);

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  res.json({ message: 'Login successful', user });
}));

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
