const express = require('express');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.get('/debug-sentry', () => {
  throw new Error('My first Sentry error!');
});

module.exports = router;
