const db = require('../db')
const { ValidationError } = require('../utils/errors')

async function loginByEmail(email) {
  const user = await db.findUserByEmail(email)
  if (!user) {
    throw new ValidationError('Invalid credentials', 401)
  }

  return {
    message: 'Login successful',
    user,
  }
}

function logout() {
  return { message: 'Logout successful' }
}

module.exports = {
  loginByEmail,
  logout,
}
