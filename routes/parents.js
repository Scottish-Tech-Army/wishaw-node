var express = require('express');
var router = express.Router();
var { isAuthenticated } = require('../middleware/auth');
var { requireRole } = require('../middleware/roleCheck');
var parentService = require('../services/parentService');
var playerService = require('../services/playerService');
var authService = require('../services/authService');
var mockOnly = require('../utils/mockOnly');

router.use(mockOnly);

router.get('/', isAuthenticated,requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var su = req.session.user;
    var [links, parents, players] = await Promise.all([
      parentService.getAll(req.session),
      authService.getParentUsers(req.session),
      playerService.getAll(req.session)
    ]);
    res.render('parents/links', { title: 'Parent Links', links: links, parents: parents, players: players, currentUser: su, success: req.query.success, error: req.query.error || null });
  } catch (err) { next(err); }
});

router.post('/link', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    if (!req.body.parentId || !req.body.playerId) return res.redirect('/parents?error=Parent and player are required');
    var result = await parentService.create(req.body, req.session);
    if (!result) return res.redirect('/parents?error=Invalid parent or player');
    res.redirect('/parents?success=Link created');
  } catch (err) { next(err); }
});

router.post('/:id/unlink', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    await parentService.remove(req.params.id, req.session);
    res.redirect('/parents?success=Link removed');
  } catch (err) { next(err); }
});

module.exports = router;
