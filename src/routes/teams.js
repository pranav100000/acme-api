const express = require('express');
const db = require('../db');
const { validateRequired } = require('../middleware/validate');
const { sendCreated, sendNotFound, sendOk, withAsync } = require('../lib/http');

const router = express.Router();

// GET /api/teams - List all teams
router.get('/', withAsync(async (req, res) => {
  const teams = await db.getAllTeams();
  sendOk(res, teams);
}));

// GET /api/teams/:id - Get team by ID
router.get('/:id', withAsync(async (req, res) => {
  const team = await db.findTeam(req.params.id);

  if (!team) {
    return sendNotFound(res, 'Team not found');
  }

  return sendOk(res, team);
}));

// GET /api/teams/:id/members - Get team members
router.get('/:id/members', withAsync(async (req, res) => {
  const members = await db.getTeamMembers(req.params.id);

  if (!members) {
    return sendNotFound(res, 'Team not found');
  }

  return sendOk(res, members);
}));

// POST /api/teams - Create team
router.post('/', validateRequired(['name']), withAsync(async (req, res) => {
  const team = await db.createTeam({ name: req.body.name });
  sendCreated(res, team);
}));

// POST /api/teams/:id/members - Add member to team
router.post('/:id/members', validateRequired(['userId']), withAsync(async (req, res) => {
  const team = await db.addTeamMember(req.params.id, req.body.userId);
  if (!team) {
    return sendNotFound(res, 'Team or user not found');
  }
  return sendOk(res, team);
}));

// DELETE /api/teams/:id/members/:userId - Remove member from team
router.delete('/:id/members/:userId', withAsync(async (req, res) => {
  const team = await db.removeTeamMember(req.params.id, req.params.userId);
  if (!team) {
    return sendNotFound(res, 'Team not found');
  }
  return sendOk(res, team);
}));

module.exports = router;
