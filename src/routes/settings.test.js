const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const db = require('../db');
const settingsRoutes = require('./settings');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/settings', settingsRoutes);
  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Internal server error' });
  });
  return app;
}

describe('Settings Routes', () => {
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

  test('GET /api/settings returns all settings', async () => {
    const res = await fetch(`${baseUrl}/api/settings`);
    assert.strictEqual(res.status, 200);
    const settings = await res.json();
    assert.strictEqual(settings.appName, 'Acme Corp');
    assert.strictEqual(settings.defaultRole, 'developer');
    assert.strictEqual(settings.allowRegistration, true);
    assert.strictEqual(settings.maintenanceMode, false);
    assert.strictEqual(settings.timezone, 'UTC');
    assert.ok(settings.updatedAt);
  });

  test('PATCH /api/settings updates settings', async () => {
    const res = await fetch(`${baseUrl}/api/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appName: 'New Corp', maintenanceMode: true })
    });
    assert.strictEqual(res.status, 200);
    const settings = await res.json();
    assert.strictEqual(settings.appName, 'New Corp');
    assert.strictEqual(settings.maintenanceMode, true);
    // Other settings should remain unchanged
    assert.strictEqual(settings.defaultRole, 'developer');
    assert.strictEqual(settings.timezone, 'UTC');
  });

  test('PATCH /api/settings ignores unknown fields', async () => {
    const res = await fetch(`${baseUrl}/api/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unknownField: 'should be ignored', appName: 'Test Corp' })
    });
    assert.strictEqual(res.status, 200);
    const settings = await res.json();
    assert.strictEqual(settings.appName, 'Test Corp');
    assert.strictEqual(settings.unknownField, undefined);
  });

  test('GET /api/settings reflects previous updates', async () => {
    const res = await fetch(`${baseUrl}/api/settings`);
    assert.strictEqual(res.status, 200);
    const settings = await res.json();
    assert.strictEqual(settings.appName, 'Test Corp');
    assert.strictEqual(settings.maintenanceMode, true);
  });
});
