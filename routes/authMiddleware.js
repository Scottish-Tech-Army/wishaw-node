// Simple session-based auth middleware
// Stores session in a plain in-memory Map keyed by session token (cookie: session_token)

const { users } = require('./mockData');

// In-memory session store: token -> { userId, role }
const sessions = new Map();

function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function createSession(userId, role) {
  const token = generateToken();
  sessions.set(token, { userId, role });
  return token;
}

function destroySession(token) {
  sessions.delete(token);
}

function getSession(req) {
  const token = req.cookies && req.cookies['session_token'];
  if (!token) return null;
  return sessions.get(token) || null;
}

/**
 * Middleware: requires the request to carry a valid session cookie.
 * Optionally pass allowed roles, e.g. requireAuth(['ADMIN', 'COACH'])
 */
function requireAuth(roles) {
  return (req, res, next) => {
    const session = getSession(req);
    if (!session) {
      return res.status(401).json({ error: 'Not Authorized' });
    }
    if (roles && roles.length && !roles.includes(session.role)) {
      return res.status(403).json({ error: 'Not Allowed' });
    }
    // Attach session info to request
    req.session = session;
    req.currentUser = users.find((u) => u.id === session.userId) || null;
    next();
  };
}

module.exports = { createSession, destroySession, getSession, requireAuth };
