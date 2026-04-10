const test = require('node:test');
const assert = require('node:assert/strict');
const {
  SESSION_KEY,
  RESULT_KEY,
  createStorage,
  saveSession,
  loadSession,
  clearSession,
  saveResult,
  loadResult,
  clearAllQuizState
} = require('../utils/storage');

test('session helpers round-trip session data', () => {
  const storage = createStorage();
  saveSession(storage, { answers: { q1: 1 } });
  assert.deepEqual(loadSession(storage), { answers: { q1: 1 } });
});

test('clearAllQuizState removes both session and result', () => {
  const storage = createStorage();
  saveSession(storage, { answers: { q1: 1 } });
  saveResult(storage, { finalType: { code: 'CTRL' } });
  clearAllQuizState(storage);
  assert.equal(loadSession(storage), null);
  assert.equal(loadResult(storage), null);
  assert.equal(SESSION_KEY, 'sbti_test_session');
  assert.equal(RESULT_KEY, 'sbti_latest_result');
});

test('clearSession removes only the active session', () => {
  const storage = createStorage();
  saveSession(storage, { answers: { q1: 2 } });
  saveResult(storage, { finalType: { code: 'BOSS' } });
  clearSession(storage);
  assert.equal(loadSession(storage), null);
  assert.deepEqual(loadResult(storage), { finalType: { code: 'BOSS' } });
});
