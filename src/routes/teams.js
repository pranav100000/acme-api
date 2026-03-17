const express = require('express');
const { validateRequired } = require('../middleware/validate');
const { asyncHandler } = require('../utils/errors');
const teamService = require('../services/team-service');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json(await teamService.listTeams());
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json(await teamService.getTeam(req.params.id));
}));

router.get('/:id/members', asyncHandler(async (req, res) => {
  res.json(await teamService.getTeamMembers(req.params.id));
}));

router.post('/', validateRequired(['name']), asyncHandler(async (req, res) => {
  res.status(201).json(await teamService.createTeam({ name: req.body.name }));
}));

router.post('/:id/members', validateRequired(['userId']), asyncHandler(async (req, res) => {
  res.json(await teamService.addMember(req.params.id, req.body.userId));
}));

router.delete('/:id/members/:userId', asyncHandler(async (req, res) => {
  res.json(await teamService.removeMember(req.params.id, req.params.userId));
}));

module.exports = router;
