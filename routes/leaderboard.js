var express = require('express');
var router = express.Router();
var { isAuthenticated } = require('../middleware/auth');
var leaderboardService = require('../services/leaderboardService');
var centreService = require('../services/centreService');
var groupService = require('../services/groupService');

router.get('/', isAuthenticated, async function (req, res, next) {
  try {
    var su = req.session.user;
    var isAdmin = su.role === 'SUPER_ADMIN' || su.role === 'CENTRE_ADMIN';
    var scope = isAdmin ? (req.query.scope || 'global') : 'global';
    var scopeId = req.query.scopeId || '';
    if (!isAdmin) {
      scopeId = '';
    }

    var entries = await leaderboardService.getLeaderboard(scope, scopeId, req.session);
    var centres = [];
    var groups = [];

    if (isAdmin) {
      var adminData = await Promise.all([
        centreService.getAll(req.session),
        groupService.getAll(null, req.session)
      ]);
      centres = adminData[0];
      groups = adminData[1];
    }

    res.render('leaderboard/index', {
      title: 'Leaderboard', entries: entries, centres: centres, groups: groups,
      selectedScope: scope, scopeId: scopeId, currentUser: su, canFilter: isAdmin
    });
  } catch (err) { next(err); }
});

module.exports = router;
