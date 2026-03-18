const express = require('express');
const { validateEmail, validateRequired } = require('../middleware/validate');
const usersController = require('../controllers/users-controller');
const { asyncHandler } = require('../utils/errors');

function createUsersRouter() {
  const router = express.Router();

  router.get('/', asyncHandler(usersController.listUsers));
  router.get('/:id', asyncHandler(usersController.getUser));
  router.get('/:id/profile', asyncHandler(usersController.getUserProfile));
  router.post('/', validateRequired(['email', 'name']), validateEmail, asyncHandler(usersController.createUser));
  router.patch('/:id', asyncHandler(usersController.updateUser));
  router.delete('/:id', asyncHandler(usersController.deactivateUser));

  return router;
}

module.exports = createUsersRouter;
