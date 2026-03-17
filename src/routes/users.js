const express = require('express');
const { validateEmail, validateRequired } = require('../middleware/validate');
const { asyncHandler } = require('../utils/errors');
const userService = require('../services/user-service');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json(await userService.listUsers());
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json(await userService.getUserSummary(req.params.id));
}));

router.get('/:id/profile', asyncHandler(async (req, res) => {
  res.json(await userService.getUserProfile(req.params.id));
}));

router.post('/', validateRequired(['email', 'name']), validateEmail, asyncHandler(async (req, res) => {
  const { email, name, role } = req.body;
  res.status(201).json(await userService.createUser({ email, name, role }));
}));

router.patch('/:id', asyncHandler(async (req, res) => {
  res.json(await userService.updateUser(req.params.id, req.body));
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  res.json(await userService.deactivateUser(req.params.id));
}));

module.exports = router;
