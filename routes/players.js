var express = require('express');
var router = express.Router();
var multer = require('multer');
var { isAuthenticated } = require('../middleware/auth');
var { requireRole } = require('../middleware/roleCheck');
var apiConfig = require('../config/apiConfig');
var playerService = require('../services/playerService');
var groupService = require('../services/groupService');
var centreService = require('../services/centreService');

var upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var players = await playerService.getAll(req.session);
    res.render('players/index', { title: 'Players', players: players, currentUser: req.session.user, success: req.query.success, error: req.query.error || null });
  } catch (err) { next(err); }
});

router.get('/create', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var su = req.session.user;
    var [groups, centres] = await Promise.all([groupService.getAll(null, req.session), centreService.getAll(req.session)]);
    res.render('players/form', { title: 'Create Player', player: null, groups: groups, centres: centres, currentUser: su, error: null, success: req.query.success || null });
  } catch (err) { next(err); }
});

router.post('/create', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var name = (req.body.displayName || '').trim();
    var username = (req.body.username || '').trim();
    var password = req.body.password || '';
    if (!name || (!apiConfig.USE_MOCK && (!username || !password))) {
      var su = req.session.user;
      var [groups, centres] = await Promise.all([groupService.getAll(null, req.session), centreService.getAll(req.session)]);
      return res.render('players/form', { title: 'Create Player', player: null, groups: groups, centres: centres, currentUser: su, error: apiConfig.USE_MOCK ? 'Display name is required.' : 'Username, password, and display name are required.', success: null });
    }
    await playerService.create(req.body, req.session);
    res.redirect('/players?success=Player created successfully');
  } catch (err) { next(err); }
});

router.get('/:id/edit', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var su = req.session.user;
    var [player, groups, centres] = await Promise.all([playerService.getById(req.params.id, req.session), groupService.getAll(null, req.session), centreService.getAll(req.session)]);
    if (!player) return res.redirect('/players');
    res.render('players/form', { title: 'Edit Player', player: player, groups: groups, centres: centres, currentUser: su, error: req.query.error || null, success: req.query.success || null });
  } catch (err) { next(err); }
});

router.post('/:id/edit', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    await playerService.update(req.params.id, req.body, req.session);
    res.redirect('/players?success=Player updated successfully');
  } catch (err) { next(err); }
});

router.post('/:id/image', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), upload.single('mediaFile'), async function (req, res, next) {
  try {
    await playerService.saveImage(req.params.id, req.file, req.body.mediaType, req.session);
    res.redirect('/players/' + req.params.id + '/edit?success=' + encodeURIComponent('Player media saved successfully'));
  } catch (err) {
    if (err && err.status && err.status < 500) {
      return res.redirect('/players/' + req.params.id + '/edit?error=' + encodeURIComponent(err.message));
    }
    next(err);
  }
});

router.post('/:id/toggle', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    await playerService.toggleActive(req.params.id, req.session);
    res.redirect('/players?success=Player status updated');
  } catch (err) { next(err); }
});

router.post('/:id/delete', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    if (!apiConfig.USE_MOCK) {
      return res.redirect('/players?error=Deleting players is not supported by the Java backend');
    }
    await playerService.remove(req.params.id, req.session);
    res.redirect('/players?success=Player deleted');
  } catch (err) { next(err); }
});

module.exports = router;
