const express = require('express');
const db = require('../db');
const { validateRequired } = require('../middleware/validate');
const { asyncHandler, assertFound } = require('../utils/errors');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json(await db.getAllTeams());
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const team = assertFound(await db.findTeam(req.params.id), 'Team not found');
  res.json(team);
}));

router.get('/:id/members', asyncHandler(async (req, res) => {
  const members = assertFound(await db.getTeamMembers(req.params.id), 'Team not found');
  res.json(members);
}));

router.post('/', validateRequired(['name']), asyncHandler(async (req, res) => {
  const team = await db.createTeam({ name: req.body.name });
  res.status(201).json(team);
}));

router.post('/:id/members', validateRequired(['userId']), asyncHandler(async (req, res) => {
  const team = assertFound(await db.addTeamMember(req.params.id, req.body.userId), 'Team or user not found');
  res.json(team);
}));

router.delete('/:id/members/:userId', asyncHandler(async (req, res) => {
  const team = assertFound(await db.removeTeamMember(req.params.id, req.params.userId), 'Team not found');
  res.json(team);
}));

module.exports = router;
