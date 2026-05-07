var express = require('express');
var router = express.Router();
var { isAuthenticated } = require('../middleware/auth');
var { requireRole } = require('../middleware/roleCheck');
var apiConfig = require('../config/apiConfig');
var centreService = require('../services/centreService');
var groupService = require('../services/groupService');
var playerService = require('../services/playerService');
var moduleService = require('../services/moduleService');
var challengeService = require('../services/challengeService');

router.get('/dashboard', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var su = req.session.user;
    var centres;
    var groups;
    var players;
    var modules;
    var challenges;

    if (apiConfig.USE_MOCK) {
      [centres, groups, players, modules, challenges] = await Promise.all([
        centreService.getAll(req.session), groupService.getAll(null, req.session), playerService.getAll(req.session),
        moduleService.getAll(req.session), challengeService.getAll(null, req.session)
      ]);
    } else {
      [centres, groups, players, modules] = await Promise.all([
        centreService.getAll(req.session), groupService.getAll(null, req.session), playerService.getAll(req.session), moduleService.getAll(req.session)
      ]);
      challenges = null;
    }
    var stats = {
      centres: centres.length,
      groups: groups.length,
      players: players.length,
      activePlayers: players.filter(function (p) { return p.active; }).length,
      modules: modules ? modules.length : null,
      challenges: challenges ? challenges.length : null
    };
    res.render('admin/dashboard', { title: 'Admin Dashboard', stats: stats, currentUser: su });
  } catch (err) { next(err); }
});

module.exports = router;
