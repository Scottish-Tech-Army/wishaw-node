var express = require('express');
var router = express.Router();
var { isAuthenticated } = require('../middleware/auth');
var { requireRole } = require('../middleware/roleCheck');
var apiConfig = require('../config/apiConfig');
var centreService = require('../services/centreService');

router.get('/', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var centres = await centreService.getAll(req.session);
    res.render('centres/index', { title: 'Centres', centres: centres, currentUser: req.session.user, success: req.query.success, error: req.query.error || null });
  } catch (err) { next(err); }
});

router.get('/create', isAuthenticated, requireRole('SUPER_ADMIN'), function (req, res) {
  res.render('centres/form', { title: 'Create Centre', centre: null, currentUser: req.session.user, error: null });
});

router.post('/create', isAuthenticated, requireRole('SUPER_ADMIN'), async function (req, res, next) {
  try {
    var name = (req.body.name || '').trim();
    var code = (req.body.code || '').trim();
    if (!name || !code) return res.render('centres/form', { title: 'Create Centre', centre: null, currentUser: req.session.user, error: 'Name and code are required.' });
    await centreService.create(req.body, req.session);
    res.redirect('/centres?success=Centre created successfully');
  } catch (err) { next(err); }
});

router.get('/:id/edit', isAuthenticated, requireRole('SUPER_ADMIN'), async function (req, res, next) {
  try {
    var centre = await centreService.getById(req.params.id, req.session);
    if (!centre) return res.redirect('/centres');
    res.render('centres/form', { title: 'Edit Centre', centre: centre, currentUser: req.session.user, error: null });
  } catch (err) { next(err); }
});

router.post('/:id/edit', isAuthenticated, requireRole('SUPER_ADMIN'), async function (req, res, next) {
  try {
    await centreService.update(req.params.id, req.body, req.session);
    res.redirect('/centres?success=Centre updated successfully');
  } catch (err) { next(err); }
});

router.post('/:id/delete', isAuthenticated, requireRole('SUPER_ADMIN'), async function (req, res, next) {
  try {
    if (!apiConfig.USE_MOCK) {
      return res.redirect('/centres?error=Deleting centres is not supported by the Java backend');
    }
    await centreService.remove(req.params.id, req.session);
    res.redirect('/centres?success=Centre deleted');
  } catch (err) { next(err); }
});

module.exports = router;
