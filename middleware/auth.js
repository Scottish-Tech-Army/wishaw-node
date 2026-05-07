// Authentication middleware
var apiConfig = require('../config/apiConfig');
var authService = require('../services/authService');

function clearSessionAndRedirect(req, res) {
  if (req.session) {
    delete req.session.user;
    delete req.session.backendCookie;
    if (typeof req.session.save === 'function') {
      return req.session.save(function () {
        res.redirect('/login');
      });
    }
  }
  res.redirect('/login');
}

async function isAuthenticated(req, res, next) {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect('/login');
    }
    if (apiConfig.USE_MOCK) {
      return next();
    }
    var currentUser = await authService.getCurrentUser(req.session);
    if (!currentUser) {
      return clearSessionAndRedirect(req, res);
    }
    req.session.user = Object.assign({}, req.session.user, currentUser);
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = { isAuthenticated: isAuthenticated };
