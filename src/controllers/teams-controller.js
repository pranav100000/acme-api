const teamsService = require('../services/teams-service');

async function listTeams(req, res) {
  const teams = await teamsService.listTeams();
  res.json(teams);
}

async function getTeam(req, res) {
  const team = await teamsService.getTeam(req.params.id);
  res.json(team);
}

async function getTeamMembers(req, res) {
  const members = await teamsService.getTeamMembers(req.params.id);
  res.json(members);
}

async function createTeam(req, res) {
  const team = await teamsService.createTeam(req.body);
  res.status(201).json(team);
}

async function addTeamMember(req, res) {
  const team = await teamsService.addTeamMember(req.params.id, req.body.userId);
  res.json(team);
}

async function removeTeamMember(req, res) {
  const team = await teamsService.removeTeamMember(req.params.id, req.params.userId);
  res.json(team);
}

module.exports = {
  addTeamMember,
  createTeam,
  getTeam,
  getTeamMembers,
  listTeams,
  removeTeamMember
};
