var crypto = require('crypto');
var apiConfig = require('../config/apiConfig');

var SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

function ensureToken(req, res, next) {
  if (req.session && !req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }

  res.locals.csrfToken = req.session ? req.session.csrfToken : null;
  res.locals.currentUser = req.session ? req.session.user : null;
  res.locals.useMock = apiConfig.USE_MOCK;
  next();
}

function verifyToken(req, res, next) {
  if (SAFE_METHODS.indexOf(req.method) !== -1) {
    return next();
  }

  var sessionToken = req.session ? req.session.csrfToken : null;
  var requestToken = null;

  if (req.body && req.body._csrf) {
    requestToken = req.body._csrf;
  } else if (req.query && req.query._csrf) {
    requestToken = req.query._csrf;
  } else if (req.headers['x-csrf-token']) {
    requestToken = req.headers['x-csrf-token'];
  }

  if (!sessionToken || !requestToken) {
    return rejectInvalidToken(req, res);
  }

  var isValid = false;

  try {
    isValid = crypto.timingSafeEqual(Buffer.from(String(sessionToken)), Buffer.from(String(requestToken)));
  } catch (_) {
    isValid = false;
  }

  if (!isValid) {
    return rejectInvalidToken(req, res);
  }

  next();
}

function rotateToken(session) {
  if (!session) return;
  session.csrfToken = crypto.randomBytes(32).toString('hex');
}

function rejectInvalidToken(req, res) {
  rotateToken(req.session);
  res.status(403).render('error', {
    title: 'Session Check Required',
    message: 'We could not verify that request. Refresh the page and try again.',
    details: 'This usually happens when a form has been open for a while, you signed in again in another tab, or the browser session changed.',
    actions: [
      { href: req.session && req.session.user ? '/' : '/login', label: 'Open a fresh page', className: 'btn btn-secondary' },
      { href: '/', label: 'Return home', className: 'btn btn-primary' }
    ],
    error: { status: 403 },
    currentUser: req.session ? req.session.user : null
  });
}

module.exports = {
  ensureToken: ensureToken,
  verifyToken: verifyToken,
  rotateToken: rotateToken
};
