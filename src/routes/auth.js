const express = require('express');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { asyncHandler } = require('../utils/errors');
const authService = require('../services/auth-service');

const router = express.Router();

router.post('/login', validateRequired(['email']), validateEmail, asyncHandler(async (req, res) => {
  res.json(await authService.login(req.body.email));
}));

router.post('/logout', asyncHandler(async (req, res) => {
  res.json(await authService.logout());
}));

module.exports = router;
