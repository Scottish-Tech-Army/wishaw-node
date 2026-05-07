var express = require('express');
var router = express.Router();
var { isAuthenticated } = require('../middleware/auth');
var { requireRole } = require('../middleware/roleCheck');
var progressService = require('../services/progressService');
var playerService = require('../services/playerService');
var challengeService = require('../services/challengeService');
var moduleService = require('../services/moduleService');
var centreService = require('../services/centreService');
var groupService = require('../services/groupService');
var mockData = require('../services/mockData');

// Award progress screen
router.get('/', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var su = req.session.user;
    var [centres, groups, modules, challenges, players] = await Promise.all([
      centreService.getAll(req.session), groupService.getAll(null, req.session), moduleService.getAll(req.session),
      challengeService.getAll(null, req.session), playerService.getAll(req.session)
    ]);
    res.render('progress/index', {
      title: 'Award Progress', centres: centres, groups: groups, modules: modules,
      challenges: challenges, players: players, badgeCategories: mockData.badgeCategories,
      currentUser: su, success: req.query.success
    });
  } catch (err) { next(err); }
});

// Submit awards
router.post('/award', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var playerIds = req.body.playerIds;
    if (!Array.isArray(playerIds)) playerIds = playerIds ? [playerIds] : [];
    if (playerIds.length === 0 || !req.body.challengeId) return res.redirect('/progress?success=No players or challenge selected');
    await progressService.awardChallenge(playerIds, req.body.challengeId, req.session);
    res.redirect('/progress?success=Awards granted successfully');
  } catch (err) { next(err); }
});

// View player progress
router.get('/player/:id', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var su = req.session.user;
    var player = await progressService.getPlayerProfile(req.params.id, req.session);
    var progress = await progressService.getPlayerProgress(req.params.id, req.session);
    if (!player) return res.redirect('/progress');
    res.render('progress/player', {
      title: player.displayName + ' - Progress', player: player, progress: progress,
      badgeCategories: mockData.badgeCategories, currentUser: su
    });
  } catch (err) { next(err); }
});

module.exports = router;
