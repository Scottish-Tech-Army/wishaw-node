var express = require('express');
var router = express.Router();
var authService = require('../services/authService');
var csrf = require('../middleware/csrf');

router.get('/login', function (req, res) {
  if (req.session && req.session.user) {
    return res.redirect(getDashboardUrl(req.session.user.role));
  }
  res.render('auth/login', { title: 'Login', error: null, currentUser: null, username: '' });
});

router.post('/login', async function (req, res, next) {
  try {
    var username = (req.body.username || '').trim();
    var password = req.body.password || '';
    if (!username || !password) {
      return res.status(400).render('auth/login', { title: 'Login', error: 'Username and password are required.', currentUser: null, username: username });
    }
    // Pass req.session so apiClient can capture and store the backend JSESSIONID cookie
    var user = await authService.login(username, password, req.session);
    if (!user) {
      return res.status(401).render('auth/login', { title: 'Login', error: 'Invalid username or password.', currentUser: null, username: username });
    }
    var backendCookie = req.session.backendCookie;
    req.session.regenerate(function (sessionErr) {
      if (sessionErr) return next(sessionErr);

      req.session.user = user;
      if (backendCookie) req.session.backendCookie = backendCookie;
      csrf.rotateToken(req.session);
      req.session.save(function (saveErr) {
        if (saveErr) return next(saveErr);
        res.redirect(getDashboardUrl(user.role));
      });
    });
  } catch (err) {
    if (err && err.status === 401) {
      return res.status(401).render('auth/login', { title: 'Login', error: 'Invalid username or password.', currentUser: null, username: username });
    }
    if (err && (err.status === 0 || err.status >= 500)) {
      return res.status(503).render('auth/login', {
        title: 'Login',
        error: 'We could not reach the live sign-in service. Please try again in a moment. If you are testing locally, make sure the backend is running.',
        currentUser: null,
        username: username
      });
    }
    next(err);
  }
});

router.post('/logout', async function (req, res) {
  try {
    await authService.logout(req.session);
  } catch (_) { /* best-effort backend logout */ }
  req.session.destroy(function () {
    res.redirect('/login');
  });
});

function getDashboardUrl(role) {
  switch (role) {
    case 'SUPER_ADMIN':
    case 'CENTRE_ADMIN':
      return '/admin/dashboard';
    case 'PLAYER':
      return '/profile/me';
    case 'PARENT':
      return '/parent/dashboard';
    default:
      return '/login';
  }
}

module.exports = router;
