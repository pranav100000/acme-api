const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const config = require('../config');
const { authenticate } = require('../middleware/auth');
const userRoutes = require('./users');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/users', authenticate, userRoutes);
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

describe('User Routes', () => {
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

  test('GET /api/users without auth returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/users`);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.error, 'Authentication required');
  });

  test('GET /api/users returns all users', async () => {
    const res = await fetch(`${baseUrl}/api/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 200);
    const users = await res.json();
    assert.ok(Array.isArray(users));
    assert.ok(users.length >= 8);
  });

  test('GET /api/users/:id returns user when found', async () => {
    const res = await fetch(`${baseUrl}/api/users/1`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 200);
    const user = await res.json();
    assert.strictEqual(user.id, '1');
    assert.strictEqual(user.email, 'alice@acme.com');
    assert.strictEqual(user.name, 'Alice Chen');
    assert.strictEqual(user.role, 'admin');
  });

  test('GET /api/users/:id/profile returns user profile', async () => {
    const res = await fetch(`${baseUrl}/api/users/1/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 200);
    const profile = await res.json();
    assert.strictEqual(profile.displayName, 'Alice Chen');
    assert.strictEqual(profile.email, 'alice@acme.com');
    assert.strictEqual(profile.initials, 'AC');
  });

  test('GET /api/users/:id returns 404 for non-existent user', async () => {
    const res = await fetch(`${baseUrl}/api/users/999`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.error, 'User not found');
  });

  test('GET /api/users/:id/profile returns 404 for non-existent user', async () => {
    const res = await fetch(`${baseUrl}/api/users/999/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.error, 'User not found');
  });

  test('PATCH /api/users/:id returns 404 for non-existent user', async () => {
    const res = await fetch(`${baseUrl}/api/users/999`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: 'Ghost' })
    });
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.error, 'User not found');
  });

  test('DELETE /api/users/:id returns 404 for non-existent user', async () => {
    const res = await fetch(`${baseUrl}/api/users/999`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.error, 'User not found');
  });

  test('POST /api/users creates a new user', async () => {
    const res = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ email: 'test@acme.com', name: 'Test User', role: 'developer' })
    });
    assert.strictEqual(res.status, 201);
    const user = await res.json();
    assert.ok(user.id);
    assert.strictEqual(user.email, 'test@acme.com');
    assert.strictEqual(user.name, 'Test User');
    assert.strictEqual(user.status, 'active');
  });

  test('POST /api/users returns 400 for invalid email', async () => {
    const res = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ email: 'not-an-email', name: 'Bad Email' })
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.error);
  });

  test('POST /api/users returns 400 for missing required fields', async () => {
    const res = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ email: 'missing@acme.com' })
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.error.includes('name'));
  });

  test('PATCH /api/users/:id updates a user', async () => {
    const res = await fetch(`${baseUrl}/api/users/2`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: 'Robert Smith' })
    });
    assert.strictEqual(res.status, 200);
    const user = await res.json();
    assert.strictEqual(user.name, 'Robert Smith');
    assert.strictEqual(user.id, '2');
  });

  test('DELETE /api/users/:id soft deletes a user', async () => {
    const res = await fetch(`${baseUrl}/api/users/3`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.message, 'User deactivated');
    assert.strictEqual(body.user.status, 'inactive');
  });
});
