const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const config = require('../config');
const { authenticate } = require('../middleware/auth');
const teamRoutes = require('./teams');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/teams', authenticate, teamRoutes);
  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Internal server error' });
  });
  return app;
}

/**
 * Generate a valid JWT token for testing
 */
function generateTestToken(userId = '1') {
  return jwt.sign(
    { userId, email: 'alice@acme.com', role: 'admin' },
    config.jwtSecret,
    { expiresIn: '1h' }
  );
}

describe('Team Routes', () => {
  let server;
  let baseUrl;
  let token;

  before(async () => {
    db._reset();
    const app = createApp();
    server = app.listen(0);
    const { port } = server.address();
    baseUrl = `http://localhost:${port}`;
    token = generateTestToken();
  });

  after(async () => {
    server.close();
    db._reset();
  });

  test('GET /api/teams without auth returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/teams`);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.error, 'Authentication required');
  });

  test('GET /api/teams returns all teams', async () => {
    const res = await fetch(`${baseUrl}/api/teams`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 200);
    const teams = await res.json();
    assert.ok(Array.isArray(teams));
    assert.ok(teams.length >= 4);
    assert.ok(teams[0].name);
    assert.ok(teams[0].id);
  });

  test('GET /api/teams/:id returns team when found', async () => {
    const res = await fetch(`${baseUrl}/api/teams/1`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 200);
    const team = await res.json();
    assert.strictEqual(team.id, '1');
    assert.strictEqual(team.name, 'Engineering');
    assert.ok(Array.isArray(team.members));
  });

  test('GET /api/teams/:id returns 404 for non-existent team', async () => {
    const res = await fetch(`${baseUrl}/api/teams/999`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.ok(body.error);
  });

  test('GET /api/teams/:id/members returns team members', async () => {
    const res = await fetch(`${baseUrl}/api/teams/1/members`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 200);
    const members = await res.json();
    assert.ok(Array.isArray(members));
    assert.ok(members.length > 0);
    assert.ok(members[0].name);
  });

  test('POST /api/teams creates a new team', async () => {
    const res = await fetch(`${baseUrl}/api/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ userId: '5' })
    });
    assert.strictEqual(res.status, 200);
    const team = await res.json();
    assert.ok(team.members.includes('5'));
  });

  test('DELETE /api/teams/:id/members/:userId removes a member from team', async () => {
    const res = await fetch(`${baseUrl}/api/teams/1/members/2`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 200);
    const team = await res.json();
    assert.ok(!team.members.includes('2'));
  });
});
