/**
 * Auth Service
 * Mock: reads from mockData.users
 * Real: POST /api/v1/auth/login  -> { userId, username, displayName, role, message }
 *       GET  /api/v1/auth/me     -> { userId, username, displayName, role }
 *       POST /api/v1/auth/logout
 * FRONTEND_INTEGRATION: swap USE_MOCK -> false and set API_BASE_URL env var
 *
 * All real-mode functions accept the full Express session object so that
 * apiClient can read/write session.backendCookie (JSESSIONID) transparently.
 */
var apiConfig = require('../config/apiConfig');
var mockData = require('./mockData');
var apiClient = require('../utils/apiClient');

/**
 * Normalise the backend AuthResponse into the node session user shape.
 * Keeps `email` populated (as username) so existing views that reference it don't break.
 * @param {object} backendUser
 * @returns {object}
 */
function normaliseUser(backendUser) {
  return {
    id: backendUser.userId,
    username: backendUser.username,
    displayName: backendUser.displayName,
    role: backendUser.role,
    // email alias: keeps views that reference user.email working during transition
    email: backendUser.username
  };
}

/**
 * @param {string} username
 * @param {string} password
 * @param {object} session  - Express session (backendCookie stored here after login)
 * @returns {Promise<object|null>}  normalised session user, or null on failure
 */
async function login(username, password, session) {
  if (apiConfig.USE_MOCK) {
    var user = mockData.users.find(function (u) {
      // Mock data uses email field; support both email and username lookups
      return (u.username === username || u.email === username) && u.password === password;
    });
    if (!user) return null;
    return { id: user.id, username: user.username || user.email, email: user.email, displayName: user.displayName, role: user.role, playerId: user.playerId, parentId: user.parentId };
  }
  // apiClient.post will capture Set-Cookie from the response and store in session
  var backendUser = await apiClient.post('/auth/login', { username: username, password: password }, session);
  return normaliseUser(backendUser);
}

/**
 * @param {object} session  - Express session
 * @returns {Promise<void>}
 */
async function logout(session) {
  if (apiConfig.USE_MOCK) return;
  return apiClient.post('/auth/logout', {}, session);
}

/**
 * Validate the current session against the backend (GET /auth/me).
 * Returns normalised user or null; callers should clear the local session on null.
 * @param {object} session  - Express session
 * @returns {Promise<object|null>}
 */
async function getCurrentUser(session) {
  if (apiConfig.USE_MOCK) {
    var sessionUser = session && session.user;
    if (!sessionUser) return null;
    var user = mockData.users.find(function (u) { return u.id === sessionUser.id; });
    if (!user) return null;
    return { id: user.id, username: user.username || user.email, email: user.email, displayName: user.displayName, role: user.role, playerId: user.playerId, parentId: user.parentId };
  }
  try {
    var backendUser = await apiClient.get('/auth/me', session);
    return normaliseUser(backendUser);
  } catch (err) {
    // 401 / 403 means backend session is gone — signal caller to clear local session
    if (err && (err.status === 401 || err.status === 403)) return null;
    throw err;
  }
}

/**
 * Get all users with PARENT role (for admin parent-link management).
 * @param {object} session  - Express session
 * @returns {Promise<Array>}
 */
async function getParentUsers(session) {
  if (apiConfig.USE_MOCK) {
    return mockData.users
      .filter(function (u) { return u.role === 'PARENT'; })
      .map(function (u) { return { id: u.id, displayName: u.displayName, email: u.email }; });
  }
  return (await apiClient.get('/admin/users', session))
    .filter(function (u) { return u.role === 'PARENT'; })
    .map(function (u) {
      return {
        id: u.id,
        displayName: u.displayName,
        email: u.username
      };
    });
}

module.exports = { login: login, logout: logout, getCurrentUser: getCurrentUser, getParentUsers: getParentUsers };
