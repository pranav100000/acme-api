const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const db = require('../db');
const authRoutes = require('./auth');
const { createTestApp } = require('../test/support/create-test-app');
const { startTestServer } = require('../test/support/test-server');

describe('Auth Routes', () => {
  let testServer;
  let baseUrl;

  before(async () => {
    db._reset();
    const app = createTestApp('/api/auth', authRoutes);
    testServer = await startTestServer(app);
    baseUrl = testServer.baseUrl;
  });

  after(async () => {
    await testServer.close();
    db._reset();
  });

  test('POST /api/auth/login with valid email returns user', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alice@acme.com' })
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.message, 'Login successful');
    assert.strictEqual(body.user.email, 'alice@acme.com');
  });

  test('POST /api/auth/login with non-existent email returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nobody@acme.com' })
    });
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.ok(body.error);
  });

  test('POST /api/auth/login with invalid email format returns 400', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-valid' })
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.error);
  });

  test('POST /api/auth/logout returns success', async () => {
    const res = await fetch(`${baseUrl}/api/auth/logout`, { method: 'POST' });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.message, 'Logout successful');
  });
});
