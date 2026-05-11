const db = require("../db");
const { ConflictError, NotFoundError } = require("../utils/errors");

function serializeUserSummary(user) {
	return {
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role,
	};
}

function serializeUserProfile(user) {
	return {
		displayName: user.name,
		email: user.email,
		initials: user.name
			.split(" ")
			.map((namePart) => namePart[0])
			.join(""),
	};
}

async function getUsers() {
	return db.getAllUsers();
}

async function getUserById(id) {
	const user = await db.findUser(id);
	if (!user) {
		throw new NotFoundError("User not found");
	}
	return user;
}

async function createUser(payload) {
	const existingUser = await db.findUserByEmail(payload.email);
	if (existingUser) {
		throw new ConflictError("Email already exists");
	}
	return db.createUser(payload);
}

async function updateUser(id, updates) {
	const user = await db.updateUser(id, updates);
	if (!user) {
		throw new NotFoundError("User not found");
	}
	return user;
}

async function deactivateUser(id) {
	const user = await db.deleteUser(id);
	if (!user) {
		throw new NotFoundError("User not found");
	}
	return { message: "User deactivated", user };
}

module.exports = {
	createUser,
	deactivateUser,
	getUserById,
	getUsers,
	serializeUserProfile,
	serializeUserSummary,
	updateUser,
};
