/**
 * @module routes/teams
 * @description Team management routes for CRUD operations and member management.
 */

const express = require('express');
const db = require('../db');
const { validateRequired } = require('../middleware/validate');

const router = express.Router();

/**
 * GET /api/teams
 * Retrieves a list of all teams.
 * @route GET /api/teams
 * @returns {Array<Team>} 200 - Array of team objects
 */
router.get('/', async (req, res) => {
  const teams = await db.getAllTeams();
  res.json(teams);
});

/**
 * GET /api/teams/:id
 * Retrieves a single team by its ID.
 * @route GET /api/teams/:id
 * @param {string} req.params.id - Team ID
 * @returns {Team} 200 - The team object
 * @returns {Object} 404 - Team not found: { error: string }
 */
router.get('/:id', async (req, res) => {
  const team = await db.findTeam(req.params.id);

  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  res.json(team);
});

/**
 * GET /api/teams/:id/members
 * Retrieves all members of a specific team as full user objects.
 * @route GET /api/teams/:id/members
 * @param {string} req.params.id - Team ID
 * @returns {Array<User>} 200 - Array of user objects belonging to the team
 * @returns {Object} 404 - Team not found: { error: string }
 */
router.get('/:id/members', async (req, res) => {
  const members = await db.getTeamMembers(req.params.id);

  if (!members) {
    return res.status(404).json({ error: 'Team not found' });
  }

  res.json(members);
});

/**
 * POST /api/teams
 * Creates a new team with the given name.
 * @route POST /api/teams
 * @param {string} req.body.name - Name for the new team
 * @returns {Team} 201 - The newly created team object
 * @returns {Object} 400 - Missing required field: { error: string }
 */
router.post('/', validateRequired(['name']), async (req, res) => {
  const team = await db.createTeam({ name: req.body.name });
  res.status(201).json(team);
});

/**
 * POST /api/teams/:id/members
 * Adds a user as a member of the specified team.
 * @route POST /api/teams/:id/members
 * @param {string} req.params.id - Team ID
 * @param {string} req.body.userId - ID of the user to add
 * @returns {Team} 200 - The updated team object
 * @returns {Object} 404 - Team or user not found: { error: string }
 */
router.post('/:id/members', validateRequired(['userId']), async (req, res) => {
  const team = await db.addTeamMember(req.params.id, req.body.userId);
  if (!team) {
    return res.status(404).json({ error: 'Team or user not found' });
  }
  res.json(team);
});

/**
 * DELETE /api/teams/:id/members/:userId
 * Removes a user from the specified team.
 * @route DELETE /api/teams/:id/members/:userId
 * @param {string} req.params.id - Team ID
 * @param {string} req.params.userId - ID of the user to remove
 * @returns {Team} 200 - The updated team object
 * @returns {Object} 404 - Team not found: { error: string }
 */
router.delete('/:id/members/:userId', async (req, res) => {
  const team = await db.removeTeamMember(req.params.id, req.params.userId);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  res.json(team);
});

module.exports = router;
