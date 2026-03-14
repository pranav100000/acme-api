const express = require('express');
const { validateRequired } = require('../middleware/validate');
const teamService = require('../services/teams');
const { asyncHandler } = require('../utils/errors');

const router = express.Router();

// GET /api/teams - List all teams
router.get('/', asyncHandler(async (req, res) => {
  res.json(await teamService.listTeams());
}));

// GET /api/teams/:id - Get team by ID
router.get('/:id', asyncHandler(async (req, res) => {
  res.json(await teamService.getTeam(req.params.id));
}));

// GET /api/teams/:id/members - Get team members
router.get('/:id/members', asyncHandler(async (req, res) => {
  res.json(await teamService.getTeamMembers(req.params.id));
}));

// POST /api/teams - Create team
router.post('/', validateRequired(['name']), asyncHandler(async (req, res) => {
  const team = await teamService.createTeam({ name: req.body.name });
  res.status(201).json(team);
}));

// POST /api/teams/:id/members - Add member to team
router.post('/:id/members', validateRequired(['userId']), asyncHandler(async (req, res) => {
  res.json(await teamService.addTeamMember(req.params.id, req.body.userId));
}));

// DELETE /api/teams/:id/members/:userId - Remove member from team
router.delete('/:id/members/:userId', asyncHandler(async (req, res) => {
  res.json(await teamService.removeTeamMember(req.params.id, req.params.userId));
}));

module.exports = router;
