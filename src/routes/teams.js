/**
 * Team management routes.
 *
 * Provides CRUD operations for teams and team membership.
 * Teams store an array of member user IDs; the /members sub-resource
 * resolves those IDs into full user objects.
 */
const express = require('express');
const db = require('../db');
const { validateRequired } = require('../middleware/validate');

const router = express.Router();

/** GET /api/teams — List all teams with their member ID arrays. */
router.get('/', async (req, res) => {
  const teams = await db.getAllTeams();
  res.json(teams);
});

/** GET /api/teams/:id — Retrieve a single team by its ID. */
router.get('/:id', async (req, res) => {
  const team = await db.findTeam(req.params.id);

  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  res.json(team);
});

/** GET /api/teams/:id/members — Resolve and return the full user objects for a team's members. */
router.get('/:id/members', async (req, res) => {
  const members = await db.getTeamMembers(req.params.id);

  if (!members) {
    return res.status(404).json({ error: 'Team not found' });
  }

  res.json(members);
});

/** POST /api/teams — Create a new team. Requires `name` in the request body. */
router.post('/', validateRequired(['name']), async (req, res) => {
  const team = await db.createTeam({ name: req.body.name });
  res.status(201).json(team);
});

/**
 * POST /api/teams/:id/members — Add a user to the team.
 * Requires `userId` in the request body. Returns 404 if team or user is missing.
 */
router.post('/:id/members', validateRequired(['userId']), async (req, res) => {
  const team = await db.addTeamMember(req.params.id, req.body.userId);
  if (!team) {
    return res.status(404).json({ error: 'Team or user not found' });
  }
  res.json(team);
});

/** DELETE /api/teams/:id/members/:userId — Remove a user from the team. */
router.delete('/:id/members/:userId', async (req, res) => {
  const team = await db.removeTeamMember(req.params.id, req.params.userId);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  res.json(team);
});

module.exports = router;
