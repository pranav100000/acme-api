const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const db = require('../db');
const authRoutes = require('./auth');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Internal server error' });
  });
  return app;
}

describe('Auth Routes', () => {
  let server;
  let baseUrl;

  before(async () => {
    db._reset();
    const app = createApp();
    server = app.listen(0);
    const { port } = server.address();
    baseUrl = `http://localhost:${port}`;
  });

  after(async () => {
    server.close();
    db._reset();
  });

  test('POST /api/auth/login with valid credentials returns token and user', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alice@acme.com', password: 'password123' })
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.message, 'Login successful');
    assert.strictEqual(body.user.email, 'alice@acme.com');
    assert.ok(body.token, 'Should return a JWT token');
    assert.strictEqual(body.user.password, undefined, 'Should not return password');
  });

  test('POST /api/auth/login with wrong password returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alice@acme.com', password: 'wrongpassword' })
    });
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.error, 'Invalid credentials');
  });

  test('POST /api/auth/login with non-existent email returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nobody@acme.com', password: 'password123' })
    });
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.ok(body.error);
  });

  test('POST /api/auth/login with invalid email format returns 400', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-valid', password: 'password123' })
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.error);
  });

  test('POST /api/auth/login with missing password returns 400', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alice@acme.com' })
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.error.includes('password'));
  });

  test('POST /api/auth/register creates a new user and returns token', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'newuser@acme.com', name: 'New User', password: 'mypassword' })
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.message, 'Registration successful');
    assert.strictEqual(body.user.email, 'newuser@acme.com');
    assert.ok(body.token, 'Should return a JWT token');
    assert.strictEqual(body.user.password, undefined, 'Should not return password');
  });

  test('POST /api/auth/register with existing email returns 409', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alice@acme.com', name: 'Duplicate', password: 'password123' })
    });
    assert.strictEqual(res.status, 409);
    const body = await res.json();
    assert.strictEqual(body.error, 'Email already registered');
  });

  test('GET /api/auth/me with valid token returns current user', async () => {
    // First login to get a token
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alice@acme.com', password: 'password123' })
    });
    const { token } = await loginRes.json();

    // Use token to get current user
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert.strictEqual(res.status, 200);
    const user = await res.json();
    assert.strictEqual(user.email, 'alice@acme.com');
    assert.strictEqual(user.name, 'Alice Chen');
    assert.strictEqual(user.password, undefined, 'Should not return password');
  });

  test('GET /api/auth/me without token returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.ok(body.error);
  });

  test('GET /api/auth/me with invalid token returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { 'Authorization': 'Bearer invalid-token-here' }
    });
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.error, 'Invalid token');
  });

  test('POST /api/auth/logout returns success', async () => {
    const res = await fetch(`${baseUrl}/api/auth/logout`, { method: 'POST' });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.message, 'Logout successful');
  });
});
