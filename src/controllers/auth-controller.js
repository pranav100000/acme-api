const authService = require('../services/auth-service');

async function login(req, res) {
  const result = await authService.login(req.body.email);
  res.json(result);
}

async function logout(req, res) {
  const result = await authService.logout();
  res.json(result);
}

module.exports = {
  login,
  logout
};
