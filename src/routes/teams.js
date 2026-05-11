const express = require("express");
const { validateRequired } = require("../middleware/validate");
const { asyncHandler } = require("../utils/errors");
const {
	addTeamMember,
	createTeam,
	getTeamById,
	getTeamMembers,
	getTeams,
	removeTeamMember,
} = require("../services/team-service");

const router = express.Router();

router.get(
	"/",
	asyncHandler(async (_req, res) => {
		res.json(await getTeams());
	}),
);

router.get(
	"/:id",
	asyncHandler(async (req, res) => {
		res.json(await getTeamById(req.params.id));
	}),
);

router.get(
	"/:id/members",
	asyncHandler(async (req, res) => {
		res.json(await getTeamMembers(req.params.id));
	}),
);

router.post(
	"/",
	validateRequired(["name"]),
	asyncHandler(async (req, res) => {
		res.status(201).json(await createTeam({ name: req.body.name }));
	}),
);

router.post(
	"/:id/members",
	validateRequired(["userId"]),
	asyncHandler(async (req, res) => {
		res.json(await addTeamMember(req.params.id, req.body.userId));
	}),
);

router.delete(
	"/:id/members/:userId",
	asyncHandler(async (req, res) => {
		res.json(await removeTeamMember(req.params.id, req.params.userId));
	}),
);

module.exports = router;
