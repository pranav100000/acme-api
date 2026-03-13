const { afterEach, describe, test } = require('node:test');
const assert = require('node:assert');

const db = require('../db');
const teamsService = require('./teams-service');

describe('teams-service', () => {
  afterEach(() => {
    db._reset();
  });

  test('getTeam returns a matching team', async () => {
    const team = await teamsService.getTeam('1');
    assert.strictEqual(team.name, 'Engineering');
  });

  test('removeTeamMember rejects missing teams', async () => {
    await assert.rejects(
      () => teamsService.removeTeamMember('999', '2'),
      { message: 'Team not found' }
    );
  });
});
