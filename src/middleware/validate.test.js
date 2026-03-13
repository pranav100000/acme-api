const { describe, test } = require('node:test');
const assert = require('node:assert');

const { validateEmail, validateRequired } = require('./validate');

describe('validate middleware', () => {
  test('validateRequired passes when all fields are present', () => {
    const middleware = validateRequired(['email', 'name']);
    let nextCalled = false;

    middleware({ body: { email: 'alice@acme.com', name: 'Alice' } }, {}, (err) => {
      assert.strictEqual(err, undefined);
      nextCalled = true;
    });

    assert.ok(nextCalled);
  });

  test('validateRequired forwards a validation error when a field is missing', () => {
    const middleware = validateRequired(['email', 'name']);

    middleware({ body: { email: 'alice@acme.com' } }, {}, (err) => {
      assert.ok(err);
      assert.strictEqual(err.statusCode, 400);
      assert.match(err.message, /name/);
    });
  });

  test('validateEmail forwards a validation error for malformed emails', () => {
    validateEmail({ body: { email: 'invalid' } }, {}, (err) => {
      assert.ok(err);
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.message, 'Invalid email format');
    });
  });
});
