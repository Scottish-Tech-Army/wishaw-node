var express = require('express');
var router = express.Router();

const { credentials, users } = require('./mockData');
const { createSession, destroySession, getSession, requireAuth } = require('./authMiddleware');

// POST /auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  const cred = credentials[username];
  if (!cred || cred.password !== password) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  const token = createSession(cred.userId, cred.role);
  res.cookie('session_token', token, { httpOnly: true, sameSite: 'lax' });

  return res.status(200).json({
    userId: cred.userId,
    role: cred.role,
    token,
  });
});

// POST /auth/logout
router.post('/logout', requireAuth(['PLAYER', 'PARENT', 'COACH', 'ADMIN']), (req, res) => {
  const token = req.cookies && req.cookies['session_token'];
  if (token) {
    destroySession(token);
    res.clearCookie('session_token');
  }
  return res.status(200).json({ message: 'Logged out successfully' });
});

// GET /auth/me
router.get('/me', requireAuth(['PLAYER', 'PARENT', 'COACH', 'ADMIN']), (req, res) => {
  const user = req.currentUser;
  if (!user) {
    return res.status(401).json({ error: 'Not Authorized' });
  }
  return res.status(200).json({
    userId: user.id,
    username: user.username,
    role: user.role,
    centreId: user.centre ? user.centre.id : null,
    displayName: user.displayName || user.username,
  });
});

module.exports = router;
