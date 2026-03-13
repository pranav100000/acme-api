const db = require('../db');
const { NotFoundError } = require('../utils/errors');

async function requireTeam(id) {
  const team = await db.findTeam(id);
  if (!team) {
    throw new NotFoundError('Team not found');
  }
  return team;
}

async function listTeams() {
  return db.getAllTeams();
}

async function getTeam(id) {
  return requireTeam(id);
}

async function getTeamMembers(id) {
  const members = await db.getTeamMembers(id);
  if (!members) {
    throw new NotFoundError('Team not found');
  }
  return members;
}

async function createTeam({ name }) {
  return db.createTeam({ name });
}

async function addTeamMember(teamId, userId) {
  const team = await db.addTeamMember(teamId, userId);
  if (!team) {
    throw new NotFoundError('Team or user not found');
  }
  return team;
}

async function removeTeamMember(teamId, userId) {
  await requireTeam(teamId);
  return db.removeTeamMember(teamId, userId);
}

module.exports = {
  addTeamMember,
  createTeam,
  getTeam,
  getTeamMembers,
  listTeams,
  removeTeamMember
};
