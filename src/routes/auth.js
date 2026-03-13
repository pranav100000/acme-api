const express = require('express');
const { validateEmail, validateRequired } = require('../middleware/validate');
const authService = require('../services/auth-service');
const { asyncHandler } = require('../utils/errors');

const router = express.Router();

// POST /api/auth/login
router.post('/login', validateRequired(['email']), validateEmail, asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
}));

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json(authService.logout());
});

module.exports = router;
