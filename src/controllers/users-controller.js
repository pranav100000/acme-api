const usersService = require('../services/users-service');

async function listUsers(req, res) {
  const users = await usersService.listUsers();
  res.json(users);
}

async function getUser(req, res) {
  const user = await usersService.getUserSummary(req.params.id);
  res.json(user);
}

async function getUserProfile(req, res) {
  const profile = await usersService.getUserProfile(req.params.id);
  res.json(profile);
}

async function createUser(req, res) {
  const user = await usersService.createUser(req.body);
  res.status(201).json(user);
}

async function updateUser(req, res) {
  const user = await usersService.updateUser(req.params.id, req.body);
  res.json(user);
}

async function deactivateUser(req, res) {
  const result = await usersService.deactivateUser(req.params.id);
  res.json(result);
}

module.exports = {
  createUser,
  deactivateUser,
  getUser,
  getUserProfile,
  listUsers,
  updateUser
};
