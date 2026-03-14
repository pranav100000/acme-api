const express = require('express');
const { validateEmail, validateRequired } = require('../middleware/validate');
const authService = require('../services/auth');
const { asyncHandler } = require('../utils/errors');

const router = express.Router();

// POST /api/auth/login
router.post('/login', validateRequired(['email']), validateEmail, asyncHandler(async (req, res) => {
  const user = await authService.loginWithEmail(req.body.email);
  res.json({ message: 'Login successful', user });
}));

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json(authService.logout());
});

module.exports = router;
