const SESSION_KEY = 'sbti_test_session';
const RESULT_KEY = 'sbti_latest_result';

function createStorage() {
  const store = new Map();
  return {
    getStorageSync(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setStorageSync(key, value) {
      store.set(key, value);
    },
    removeStorageSync(key) {
      store.delete(key);
    }
  };
}

function get(storageApi, key) {
  return storageApi.getStorageSync(key);
}

function set(storageApi, key, value) {
  storageApi.setStorageSync(key, value);
}

function remove(storageApi, key) {
  storageApi.removeStorageSync(key);
}

function saveSession(storageApi, session) {
  set(storageApi, SESSION_KEY, session);
}

function loadSession(storageApi) {
  return get(storageApi, SESSION_KEY);
}

function clearSession(storageApi) {
  remove(storageApi, SESSION_KEY);
}

function saveResult(storageApi, result) {
  set(storageApi, RESULT_KEY, result);
}

function loadResult(storageApi) {
  return get(storageApi, RESULT_KEY);
}

function clearAllQuizState(storageApi) {
  clearSession(storageApi);
  remove(storageApi, RESULT_KEY);
}

module.exports = {
  SESSION_KEY,
  RESULT_KEY,
  clearAllQuizState,
  clearSession,
  createStorage,
  loadResult,
  loadSession,
  saveResult,
  saveSession
};
