var express = require('express');
var router = express.Router();
var { isAuthenticated } = require('../middleware/auth');
var { requireRole } = require('../middleware/roleCheck');
var apiConfig = require('../config/apiConfig');
var playerService = require('../services/playerService');
var progressService = require('../services/progressService');
var moduleService = require('../services/moduleService');
var challengeService = require('../services/challengeService');
var mockData = require('../services/mockData');

// My profile - current logged-in player
router.get('/me', isAuthenticated, requireRole('PLAYER'), async function (req, res, next) {
  try {
    var user = req.session.user;
    if (user.role === 'PLAYER' && apiConfig.USE_MOCK && user.playerId) {
      var [player, progress, modules, challenges] = await Promise.all([
        playerService.getById(user.playerId, req.session),
        progressService.getPlayerProgress(user.playerId, req.session),
        moduleService.getAll(req.session),
        challengeService.getAll(null, req.session)
      ]);
      // Derive enrolled/completed modules from awards
      var awardedModuleIds = {};
      (progress.awards || []).forEach(function (a) { awardedModuleIds[a.moduleId] = true; });
      var enrolledModules = (modules || []).filter(function (m) { return m.active && awardedModuleIds[m.id]; });
      var completedModules = enrolledModules.filter(function (m) {
        var moduleChallenges = (challenges || []).filter(function (c) { return c.moduleId === m.id; });
        if (moduleChallenges.length === 0) return false;
        return moduleChallenges.every(function (c) {
          return (progress.awards || []).some(function (a) { return a.challengeId === c.id; });
        });
      });
      return res.render('profile/me', {
        title: 'My Profile', player: player, progress: progress,
        enrolledModules: enrolledModules, completedModules: completedModules,
        badgeCategories: mockData.badgeCategories, currentUser: user
      });
    }
    if (user.role === 'PLAYER' && !apiConfig.USE_MOCK) {
      // Fetch sequentially to avoid backend first-access races while progress rows are initialised.
      var myProfile = await progressService.getMyProfile(req.session);
      var myProgress = await progressService.getMyProgress(req.session);
      return res.render('profile/me', {
        title: 'My Profile',
        player: myProfile,
        progress: myProgress,
        enrolledModules: [],
        completedModules: [],
        badgeCategories: mockData.badgeCategories,
        currentUser: user
      });
    }
  } catch (err) { next(err); }
});

module.exports = router;
