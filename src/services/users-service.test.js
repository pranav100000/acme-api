const { afterEach, describe, test } = require('node:test');
const assert = require('node:assert');

const db = require('../db');
const usersService = require('./users-service');

describe('users-service', () => {
  afterEach(() => {
    db._reset();
  });

  test('getUserSummary returns serialized user fields', async () => {
    const user = await usersService.getUserSummary('1');
    assert.deepStrictEqual(user, {
      id: '1',
      email: 'alice@acme.com',
      name: 'Alice Chen',
      role: 'admin'
    });
  });

  test('getUserProfile returns derived profile fields', async () => {
    const profile = await usersService.getUserProfile('1');
    assert.deepStrictEqual(profile, {
      displayName: 'Alice Chen',
      email: 'alice@acme.com',
      initials: 'AC'
    });
  });

  test('createUser rejects duplicate emails', async () => {
    await assert.rejects(
      () => usersService.createUser({ email: 'alice@acme.com', name: 'Alice Clone' }),
      { message: 'Email already exists' }
    );
  });
});
