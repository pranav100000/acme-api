const db = require("../db");
const { UnauthorizedError } = require("../utils/errors");

async function loginWithEmail(email) {
	const user = await db.findUserByEmail(email);
	if (!user) {
		throw new UnauthorizedError("Invalid credentials");
	}
	return { message: "Login successful", user };
}

function logout() {
	return { message: "Logout successful" };
}

module.exports = { loginWithEmail, logout };
