const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const db = require('../db');
const { createTestApp } = require('../test-utils');
const statsRoutes = require('./stats');

describe('Stats Routes', () => {
  let server;
  let baseUrl;

  before(async () => {
    db._reset();
    const app = createTestApp('/api/stats', statsRoutes);
    server = app.listen(0);
    const { port } = server.address();
    baseUrl = `http://localhost:${port}`;
  });

  after(async () => {
    server.close();
    db._reset();
  });

  test('GET /api/stats returns summary statistics', async () => {
    const res = await fetch(`${baseUrl}/api/stats`);
    assert.strictEqual(res.status, 200);
    const stats = await res.json();
    assert.ok(stats.users);
    assert.ok(stats.teams);
    assert.strictEqual(typeof stats.users.total, 'number');
    assert.strictEqual(typeof stats.users.active, 'number');
    assert.strictEqual(typeof stats.users.inactive, 'number');
    assert.strictEqual(typeof stats.users.pending, 'number');
    assert.ok(stats.users.byRole);
    assert.strictEqual(typeof stats.teams.total, 'number');
    assert.strictEqual(typeof stats.teams.totalMemberships, 'number');
  });

  test('GET /api/stats user counts add up to total', async () => {
    const res = await fetch(`${baseUrl}/api/stats`);
    const stats = await res.json();
    const sum = stats.users.active + stats.users.inactive + stats.users.pending;
    assert.strictEqual(sum, stats.users.total);
  });

  test('GET /api/stats byRole counts add up to total users', async () => {
    const res = await fetch(`${baseUrl}/api/stats`);
    const stats = await res.json();
    const roleTotal = Object.values(stats.users.byRole).reduce((a, b) => a + b, 0);
    assert.strictEqual(roleTotal, stats.users.total);
  });
});
