const express = require('express');
const db = require('../db');
const { UnauthorizedError, asyncHandler } = require('../utils/errors');
const { validateEmail, validateRequired } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/login',
  validateRequired(['email']),
  validateEmail,
  asyncHandler(async (req, res) => {
    const user = await db.findUserByEmail(req.body.email);

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    res.json({ message: 'Login successful', user });
  })
);

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
