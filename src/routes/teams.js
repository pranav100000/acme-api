const express = require('express');
const { validateRequired } = require('../middleware/validate');
const teamsService = require('../services/teams-service');
const { asyncHandler } = require('../utils/errors');

const router = express.Router();

// GET /api/teams - List all teams
router.get('/', asyncHandler(async (req, res) => {
  const teams = await teamsService.listTeams();
  res.json(teams);
}));

// GET /api/teams/:id - Get team by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const team = await teamsService.getTeam(req.params.id);
  res.json(team);
}));

// GET /api/teams/:id/members - Get team members
router.get('/:id/members', asyncHandler(async (req, res) => {
  const members = await teamsService.getTeamMembers(req.params.id);
  res.json(members);
}));

// POST /api/teams - Create team
router.post('/', validateRequired(['name']), asyncHandler(async (req, res) => {
  const team = await teamsService.createTeam(req.body);
  res.status(201).json(team);
}));

// POST /api/teams/:id/members - Add member to team
router.post('/:id/members', validateRequired(['userId']), asyncHandler(async (req, res) => {
  const team = await teamsService.addTeamMember(req.params.id, req.body.userId);
  res.json(team);
}));

// DELETE /api/teams/:id/members/:userId - Remove member from team
router.delete('/:id/members/:userId', asyncHandler(async (req, res) => {
  const team = await teamsService.removeTeamMember(req.params.id, req.params.userId);
  res.json(team);
}));

module.exports = router;
