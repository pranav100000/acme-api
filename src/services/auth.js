const db = require('../db');
const { AppError } = require('../utils/errors');

async function loginWithEmail(email) {
  const user = await db.findUserByEmail(email);
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }
  return user;
}

function logout() {
  return { message: 'Logout successful' };
}

module.exports = {
  loginWithEmail,
  logout,
};
