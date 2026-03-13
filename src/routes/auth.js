const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { asyncHandler } = require('../utils/errors');

const router = express.Router();

router.post('/login', validateRequired(['email']), validateEmail, asyncHandler(async (req, res) => {
  const user = await db.findUserByEmail(req.body.email);
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }
  res.json({ message: 'Login successful', user });
}));

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
