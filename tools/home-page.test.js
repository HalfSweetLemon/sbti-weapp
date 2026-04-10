const test = require('node:test');
const assert = require('node:assert/strict');
const { decideStartMode } = require('../pages/home/index.logic');

test('home page shows resume mode when a session exists', () => {
  assert.equal(decideStartMode({ answers: { q1: 2 } }), 'resume');
  assert.equal(decideStartMode(null), 'new');
});
