const express = require('express');
const { validateEmail, validateRequired } = require('../middleware/validate');
const authController = require('../controllers/auth-controller');
const { asyncHandler } = require('../utils/errors');

function createAuthRouter() {
  const router = express.Router();

  router.post('/login', validateRequired(['email']), validateEmail, asyncHandler(authController.login));
  router.post('/logout', asyncHandler(authController.logout));

  return router;
}

module.exports = createAuthRouter;
