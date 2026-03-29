const express = require('express');
const db = require('../db');
const { validateRequired } = require('../middleware/validate');
const { route, sendNotFound } = require('./helpers');

const router = express.Router();

// GET /api/teams - List all teams
router.get('/', route(async (req, res) => {
  const teams = await db.getAllTeams();
  res.json(teams);
}));

// GET /api/teams/:id - Get team by ID
router.get('/:id', route(async (req, res) => {
  const team = await db.findTeam(req.params.id);

  if (!team) {
    return sendNotFound(res, 'Team');
  }

  res.json(team);
}));

// GET /api/teams/:id/members - Get team members
router.get('/:id/members', route(async (req, res) => {
  const members = await db.getTeamMembers(req.params.id);

  if (!members) {
    return sendNotFound(res, 'Team');
  }

  res.json(members);
}));

// POST /api/teams - Create team
router.post('/', validateRequired(['name']), route(async (req, res) => {
  const team = await db.createTeam({ name: req.body.name });
  res.status(201).json(team);
}));

// POST /api/teams/:id/members - Add member to team
router.post('/:id/members', validateRequired(['userId']), route(async (req, res) => {
  const team = await db.addTeamMember(req.params.id, req.body.userId);
  if (!team) {
    return sendNotFound(res, 'Team or user');
  }
  res.json(team);
}));

// DELETE /api/teams/:id/members/:userId - Remove member from team
router.delete('/:id/members/:userId', route(async (req, res) => {
  const team = await db.removeTeamMember(req.params.id, req.params.userId);
  if (!team) {
    return sendNotFound(res, 'Team');
  }
  res.json(team);
}));

module.exports = router;
