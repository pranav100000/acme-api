const express = require("express");
const { validateEmail, validateRequired } = require("../middleware/validate");
const { asyncHandler } = require("../utils/errors");
const {
	createUser,
	deactivateUser,
	getUserById,
	getUsers,
	serializeUserProfile,
	serializeUserSummary,
	updateUser,
} = require("../services/user-service");

const router = express.Router();

router.get(
	"/",
	asyncHandler(async (_req, res) => {
		res.json(await getUsers());
	}),
);

router.get(
	"/:id",
	asyncHandler(async (req, res) => {
		const user = await getUserById(req.params.id);
		res.json(serializeUserSummary(user));
	}),
);

router.get(
	"/:id/profile",
	asyncHandler(async (req, res) => {
		const user = await getUserById(req.params.id);
		res.json(serializeUserProfile(user));
	}),
);

router.post(
	"/",
	validateRequired(["email", "name"]),
	validateEmail,
	asyncHandler(async (req, res) => {
		const { email, name, role } = req.body;
		res.status(201).json(await createUser({ email, name, role }));
	}),
);

router.patch(
	"/:id",
	asyncHandler(async (req, res) => {
		res.json(await updateUser(req.params.id, req.body));
	}),
);

router.delete(
	"/:id",
	asyncHandler(async (req, res) => {
		res.json(await deactivateUser(req.params.id));
	}),
);

module.exports = router;
