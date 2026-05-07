var express = require('express');
var router = express.Router();
var { isAuthenticated } = require('../middleware/auth');
var { requireRole } = require('../middleware/roleCheck');
var apiConfig = require('../config/apiConfig');
var parentService = require('../services/parentService');
var playerService = require('../services/playerService');
var progressService = require('../services/progressService');
var mockData = require('../services/mockData');

router.get('/dashboard', isAuthenticated, requireRole('PARENT'), async function (req, res, next) {
  try {
    var su = req.session.user;
    if (!apiConfig.USE_MOCK) {
      var linkedPlayers = await parentService.getLinkedPlayers(req.session);
      return res.render('parentArea/dashboard', { title: 'Parent Dashboard', children: linkedPlayers, currentUser: su });
    }
    if (!su.parentId) return res.render('parentArea/dashboard', { title: 'Parent Dashboard', children: [], currentUser: su });
    var links = await parentService.getByParentId(su.parentId, req.session);
    var children = await Promise.all(links.map(async function (l) {
      var player = await playerService.getById(l.playerId, req.session);
      return player || { id: l.playerId, displayName: l.playerName };
    }));
    res.render('parentArea/dashboard', { title: 'Parent Dashboard', children: children, currentUser: su });
  } catch (err) { next(err); }
});

router.get('/child/:id', isAuthenticated, requireRole('PARENT'), async function (req, res, next) {
  try {
    var su = req.session.user;
    if (!apiConfig.USE_MOCK) {
      var children = await parentService.getLinkedPlayers(req.session);
      var hasLinkedChild = children.some(function (child) { return child.id === parseInt(req.params.id); });
      if (!hasLinkedChild) {
        return res.status(403).render('error', { title: 'Access Denied', message: 'You do not have access to this player.', error: { status: 403 }, currentUser: su });
      }
      var linkedPlayer = await parentService.getLinkedPlayerProfile(req.params.id, req.session);
      var linkedProgress = await parentService.getLinkedPlayerProgress(req.params.id, req.session);
      return res.render('parentArea/child', {
        title: linkedPlayer.displayName + ' - Progress',
        player: linkedPlayer,
        progress: linkedProgress,
        badgeCategories: mockData.badgeCategories,
        currentUser: su
      });
    }
    if (!su.parentId) return res.status(403).render('error', { title: 'Access Denied', message: 'No parent profile linked.', error: { status: 403 }, currentUser: su });
    var links = await parentService.getByParentId(su.parentId, req.session);
    var hasAccess = links.some(function (l) { return l.playerId === parseInt(req.params.id); });
    if (!hasAccess) {
      return res.status(403).render('error', { title: 'Access Denied', message: 'You do not have access to this player.', error: { status: 403 }, currentUser: su });
    }
    var [player, progress] = await Promise.all([playerService.getById(req.params.id, req.session), progressService.getPlayerProgress(req.params.id, req.session)]);
    if (!player) return res.redirect('/parent/dashboard');
    res.render('parentArea/child', {
      title: player.displayName + ' - Progress', player: player, progress: progress,
      badgeCategories: mockData.badgeCategories, currentUser: su
    });
  } catch (err) { next(err); }
});

module.exports = router;
