const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const db = require('../db');
const teamRoutes = require('./teams');
const { createTestApp } = require('../test/support/create-test-app');
const { startTestServer } = require('../test/support/test-server');

describe('Team Routes', () => {
  let testServer;
  let baseUrl;

  before(async () => {
    db._reset();
    const app = createTestApp('/api/teams', teamRoutes);
    testServer = await startTestServer(app);
    baseUrl = testServer.baseUrl;
  });

  after(async () => {
    await testServer.close();
    db._reset();
  });

  test('GET /api/teams returns all teams', async () => {
    const res = await fetch(`${baseUrl}/api/teams`);
    assert.strictEqual(res.status, 200);
    const teams = await res.json();
    assert.ok(Array.isArray(teams));
    assert.ok(teams.length >= 4);
    assert.ok(teams[0].name);
    assert.ok(teams[0].id);
  });

  test('GET /api/teams/:id returns team when found', async () => {
    const res = await fetch(`${baseUrl}/api/teams/1`);
    assert.strictEqual(res.status, 200);
    const team = await res.json();
    assert.strictEqual(team.id, '1');
    assert.strictEqual(team.name, 'Engineering');
    assert.ok(Array.isArray(team.members));
  });

  test('GET /api/teams/:id returns 404 for non-existent team', async () => {
    const res = await fetch(`${baseUrl}/api/teams/999`);
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.ok(body.error);
  });

  test('GET /api/teams/:id/members returns team members', async () => {
    const res = await fetch(`${baseUrl}/api/teams/1/members`);
    assert.strictEqual(res.status, 200);
    const members = await res.json();
    assert.ok(Array.isArray(members));
    assert.ok(members.length > 0);
    assert.ok(members[0].name);
  });

  test('POST /api/teams creates a new team', async () => {
    const res = await fetch(`${baseUrl}/api/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Marketing' })
    });
    assert.strictEqual(res.status, 201);
    const team = await res.json();
    assert.ok(team.id);
    assert.strictEqual(team.name, 'Marketing');
    assert.deepStrictEqual(team.members, []);
  });

  test('POST /api/teams/:id/members adds a member to team', async () => {
    const res = await fetch(`${baseUrl}/api/teams/3/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: '5' })
    });
    assert.strictEqual(res.status, 200);
    const team = await res.json();
    assert.ok(team.members.includes('5'));
  });

  test('DELETE /api/teams/:id/members/:userId removes a member from team', async () => {
    const res = await fetch(`${baseUrl}/api/teams/1/members/2`, { method: 'DELETE' });
    assert.strictEqual(res.status, 200);
    const team = await res.json();
    assert.ok(!team.members.includes('2'));
  });
});
