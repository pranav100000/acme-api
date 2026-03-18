const db = require('../db');
const { UnauthorizedError } = require('../utils/errors');

async function login(email) {
  const user = await db.findUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  return {
    message: 'Login successful',
    user
  };
}

async function logout() {
  return { message: 'Logout successful' };
}

module.exports = {
  login,
  logout
};
