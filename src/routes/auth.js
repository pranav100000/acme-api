const express = require("express");
const { validateEmail, validateRequired } = require("../middleware/validate");
const { asyncHandler } = require("../utils/errors");
const { loginWithEmail, logout } = require("../services/auth-service");

const router = express.Router();

router.post(
	"/login",
	validateRequired(["email"]),
	validateEmail,
	asyncHandler(async (req, res) => {
		res.json(await loginWithEmail(req.body.email));
	}),
);

router.post("/logout", (_req, res) => {
	res.json(logout());
});

module.exports = router;
