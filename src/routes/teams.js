const express = require('express');
const { validateRequired } = require('../middleware/validate');
const teamsController = require('../controllers/teams-controller');
const { asyncHandler } = require('../utils/errors');

function createTeamsRouter() {
  const router = express.Router();

  router.get('/', asyncHandler(teamsController.listTeams));
  router.get('/:id', asyncHandler(teamsController.getTeam));
  router.get('/:id/members', asyncHandler(teamsController.getTeamMembers));
  router.post('/', validateRequired(['name']), asyncHandler(teamsController.createTeam));
  router.post('/:id/members', validateRequired(['userId']), asyncHandler(teamsController.addTeamMember));
  router.delete('/:id/members/:userId', asyncHandler(teamsController.removeTeamMember));

  return router;
}

module.exports = createTeamsRouter;
