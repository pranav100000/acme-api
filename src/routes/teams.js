const express = require('express');
const db = require('../db');
const { validateRequired } = require('../middleware/validate');
const { NotFoundError, asyncHandler } = require('../utils/errors');

const router = express.Router();

const findTeamOrThrow = async (id) => {
  const team = await db.findTeam(id);

  if (!team) {
    throw new NotFoundError('Team not found');
  }

  return team;
};

// GET /api/teams - List all teams
router.get('/', asyncHandler(async (req, res) => {
  const teams = await db.getAllTeams();
  res.json(teams);
}));

// GET /api/teams/:id - Get team by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const team = await findTeamOrThrow(req.params.id);
  res.json(team);
}));

// GET /api/teams/:id/members - Get team members
router.get('/:id/members', asyncHandler(async (req, res) => {
  const members = await db.getTeamMembers(req.params.id);

  if (!members) {
    throw new NotFoundError('Team not found');
  }

  res.json(members);
}));

// POST /api/teams - Create team
router.post('/', validateRequired(['name']), asyncHandler(async (req, res) => {
  const team = await db.createTeam({ name: req.body.name });
  res.status(201).json(team);
}));

// POST /api/teams/:id/members - Add member to team
router.post('/:id/members', validateRequired(['userId']), asyncHandler(async (req, res) => {
  const team = await db.addTeamMember(req.params.id, req.body.userId);

  if (!team) {
    throw new NotFoundError('Team or user not found');
  }

  res.json(team);
}));

// DELETE /api/teams/:id/members/:userId - Remove member from team
router.delete('/:id/members/:userId', asyncHandler(async (req, res) => {
  const team = await db.removeTeamMember(req.params.id, req.params.userId);

  if (!team) {
    throw new NotFoundError('Team not found');
  }

  res.json(team);
}));

module.exports = router;
