const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/settings - Get all settings
router.get('/', async (req, res) => {
  const settings = await db.getSettings();
  res.json(settings);
});

// PATCH /api/settings - Update settings
router.patch('/', async (req, res) => {
  const settings = await db.updateSettings(req.body);
  res.json(settings);
});

module.exports = router;
