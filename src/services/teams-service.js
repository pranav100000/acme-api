const db = require('../db');
const { NotFoundError } = require('../utils/errors');

async function listTeams() {
  return db.getAllTeams();
}

async function getTeam(id) {
  const team = await db.findTeam(id);
  if (!team) {
    throw new NotFoundError('Team not found');
  }

  return team;
}

async function getTeamMembers(id) {
  const members = await db.getTeamMembers(id);
  if (!members) {
    throw new NotFoundError('Team not found');
  }

  return members;
}

async function createTeam(teamInput) {
  return db.createTeam(teamInput);
}

async function addTeamMember(id, userId) {
  const team = await db.addTeamMember(id, userId);
  if (!team) {
    throw new NotFoundError('Team or user not found');
  }

  return team;
}

async function removeTeamMember(id, userId) {
  const team = await db.removeTeamMember(id, userId);
  if (!team) {
    throw new NotFoundError('Team not found');
  }

  return team;
}

module.exports = {
  addTeamMember,
  createTeam,
  getTeam,
  getTeamMembers,
  listTeams,
  removeTeamMember
};
