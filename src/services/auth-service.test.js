const { afterEach, describe, test } = require('node:test');
const assert = require('node:assert');

const db = require('../db');
const authService = require('./auth-service');

describe('auth-service', () => {
  afterEach(() => {
    db._reset();
  });

  test('login returns success payload for a known user', async () => {
    const result = await authService.login({ email: 'alice@acme.com' });
    assert.strictEqual(result.message, 'Login successful');
    assert.strictEqual(result.user.email, 'alice@acme.com');
  });

  test('login rejects unknown users', async () => {
    await assert.rejects(
      () => authService.login({ email: 'missing@acme.com' }),
      { message: 'Invalid credentials' }
    );
  });

  test('logout returns a static success payload', () => {
    assert.deepStrictEqual(authService.logout(), { message: 'Logout successful' });
  });
});
