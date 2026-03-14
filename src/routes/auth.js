const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { sendOk, withAsync } = require('../lib/http');

const router = express.Router();

// POST /api/auth/login
router.post('/login', validateRequired(['email']), validateEmail, withAsync(async (req, res) => {
  const user = await db.findUserByEmail(req.body.email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  return sendOk(res, { message: 'Login successful', user });
}));

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  sendOk(res, { message: 'Logout successful' });
});

module.exports = router;
