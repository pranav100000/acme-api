const express = require('express');
const db = require('../db');
const { validateRequired } = require('../middleware/validate');
const { NotFoundError } = require('../utils/errors');

const router = express.Router();

router.get('/', async (req, res) => {
  const teams = await db.getAllTeams();
  res.json(teams);
});

router.get('/:id', async (req, res) => {
  const team = await db.findTeam(req.params.id);
  if (!team) throw new NotFoundError('Team not found');

  res.json(team);
});

router.get('/:id/members', async (req, res) => {
  const members = await db.getTeamMembers(req.params.id);
  if (!members) throw new NotFoundError('Team not found');

  res.json(members);
});

router.post('/', validateRequired(['name']), async (req, res) => {
  const team = await db.createTeam({ name: req.body.name });
  res.status(201).json(team);
});

router.post('/:id/members', validateRequired(['userId']), async (req, res) => {
  const team = await db.addTeamMember(req.params.id, req.body.userId);
  if (!team) throw new NotFoundError('Team or user not found');

  res.json(team);
});

router.delete('/:id/members/:userId', async (req, res) => {
  const team = await db.removeTeamMember(req.params.id, req.params.userId);
  if (!team) throw new NotFoundError('Team not found');

  res.json(team);
});

module.exports = router;
