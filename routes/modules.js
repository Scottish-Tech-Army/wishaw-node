var express = require('express');
var router = express.Router();
var { isAuthenticated } = require('../middleware/auth');
var { requireRole } = require('../middleware/roleCheck');
var apiConfig = require('../config/apiConfig');
var moduleService = require('../services/moduleService');
var mockData = require('../services/mockData');

function renderForm(res, options) {
  res.render('modules/form', {
    title: options.title,
    mod: options.mod,
    badgeCategories: mockData.badgeCategories,
    currentUser: options.currentUser,
    error: options.error || null
  });
}

function getErrorMessage(err, fallback) {
  if (err && err.body) {
    if (typeof err.body === 'string') return err.body;
    if (err.body.message) return err.body.message;
    if (err.body.error) return err.body.error;
  }
  return err && err.message ? err.message : fallback;
}

router.get('/', isAuthenticated,requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var modules = await moduleService.getAll(req.session);
    res.render('modules/index', {
      title: 'Modules',
      modules: modules,
      badgeCategories: mockData.badgeCategories,
      currentUser: req.session.user,
      success: req.query.success,
      error: req.query.error || null
    });
  } catch (err) { next(err); }
});

router.get('/create', isAuthenticated, requireRole('SUPER_ADMIN'), function (req, res) {
  renderForm(res, { title: 'Create Module', mod: null, currentUser: req.session.user, error: null });
});

router.post('/create', isAuthenticated, requireRole('SUPER_ADMIN'), async function (req, res, next) {
  var mod = apiConfig.USE_MOCK ? req.body : {
    name: (req.body.name || '').trim(),
    gameName: (req.body.gameName || '').trim(),
    description: (req.body.description || '').trim()
  };
  try {
    if (!mod.name) return renderForm(res, { title: 'Create Module', mod: mod, currentUser: req.session.user, error: 'Name is required.' });
    await moduleService.create(mod, req.session);
    res.redirect('/modules?success=Module created successfully');
  } catch (err) {
    renderForm(res, { title: 'Create Module', mod: mod, currentUser: req.session.user, error: getErrorMessage(err, 'Failed to create module.') });
  }
});

router.get('/:id/edit', isAuthenticated, requireRole('SUPER_ADMIN'), async function (req, res, next) {
  try {
    var mod = await moduleService.getById(req.params.id, req.session);
    if (!mod) return res.redirect('/modules');
    renderForm(res, { title: 'Edit Module', mod: mod, currentUser: req.session.user, error: null });
  } catch (err) { next(err); }
});

router.post('/:id/edit', isAuthenticated, requireRole('SUPER_ADMIN'), async function (req, res, next) {
  var mod = apiConfig.USE_MOCK ? Object.assign({ id: parseInt(req.params.id) }, req.body) : {
    id: parseInt(req.params.id),
    name: (req.body.name || '').trim(),
    gameName: (req.body.gameName || '').trim(),
    description: (req.body.description || '').trim(),
    active: req.body.active === 'true',
    approved: req.body.approved === 'true'
  };
  try {
    if (!mod.name) return renderForm(res, { title: 'Edit Module', mod: mod, currentUser: req.session.user, error: 'Name is required.' });
    await moduleService.update(req.params.id, mod, req.session);
    res.redirect('/modules?success=Module updated successfully');
  } catch (err) {
    renderForm(res, { title: 'Edit Module', mod: mod, currentUser: req.session.user, error: getErrorMessage(err, 'Failed to update module.') });
  }
});

router.post('/:id/delete', isAuthenticated, requireRole('SUPER_ADMIN'), async function (req, res, next) {
  if (!apiConfig.USE_MOCK) return res.redirect('/modules?error=Module deletion is not available in live mode yet.');
  try {
    await moduleService.remove(req.params.id, req.session);
    res.redirect('/modules?success=Module deleted');
  } catch (err) { next(err); }
});

module.exports = router;
