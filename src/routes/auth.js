/**
 * @module routes/auth
 * @description Authentication routes for user login and logout.
 */

const express = require('express');
const db = require('../db');
const { validateEmail, validateRequired } = require('../middleware/validate');

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticates a user by email address.
 * @route POST /api/auth/login
 * @param {string} req.body.email - The user's email address
 * @returns {Object} 200 - Login success with user data: { message: string, user: User }
 * @returns {Object} 401 - Invalid credentials: { error: string }
 * @returns {Object} 400 - Missing or invalid email: { error: string }
 */
router.post('/login', validateRequired(['email']), validateEmail, async (req, res) => {
  const user = await db.findUserByEmail(req.body.email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', user });
});

/**
 * POST /api/auth/logout
 * Logs out the current user session.
 * @route POST /api/auth/logout
 * @returns {Object} 200 - Logout confirmation: { message: string }
 */
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
