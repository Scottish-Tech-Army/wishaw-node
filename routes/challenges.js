var express = require('express');
var router = express.Router();
var { isAuthenticated } = require('../middleware/auth');
var { requireRole } = require('../middleware/roleCheck');
var challengeService = require('../services/challengeService');
var moduleService = require('../services/moduleService');
var mockData = require('../services/mockData');
var apiConfig = require('../config/apiConfig');

// Challenge CRUD now works in live mode for create/update
// DELETE not implemented in backend - will show error in live mode

router.get('/', isAuthenticated,requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var su = req.session.user;
    var [challenges, modules] = await Promise.all([challengeService.getAll(req.query.moduleId, req.session), moduleService.getAll(req.session)]);
    res.render('challenges/index', { title: 'Challenges', challenges: challenges, modules: modules, selectedModuleId: req.query.moduleId || '', badgeCategories: mockData.badgeCategories, currentUser: su, success: req.query.success });
  } catch (err) { next(err); }
});

router.get('/create', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var modules = await moduleService.getAll(req.session);
    res.render('challenges/form', { title: 'Create Challenge', challenge: null, modules: modules, badgeCategories: mockData.badgeCategories, currentUser: req.session.user, error: null });
  } catch (err) { next(err); }
});

router.post('/create', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var name = (req.body.name || '').trim();
    if (!name) {
      var modules = await moduleService.getAll(req.session);
      return res.render('challenges/form', { title: 'Create Challenge', challenge: null, modules: modules, badgeCategories: mockData.badgeCategories, currentUser: req.session.user, error: 'Name is required.' });
    }
    await challengeService.create(req.body, req.session);
    res.redirect('/challenges?success=Challenge created successfully');
  } catch (err) { next(err); }
});

router.get('/:id/edit', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var su = req.session.user;
    var [challenge, modules] = await Promise.all([challengeService.getById(req.params.id, req.session), moduleService.getAll(req.session)]);
    if (!challenge) return res.redirect('/challenges');
    res.render('challenges/form', { title: 'Edit Challenge', challenge: challenge, modules: modules, badgeCategories: mockData.badgeCategories, currentUser: su, error: null });
  } catch (err) { next(err); }
});

router.post('/:id/edit', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    await challengeService.update(req.params.id, req.body, req.session);
    res.redirect('/challenges?success=Challenge updated successfully');
  } catch (err) { next(err); }
});

router.post('/:id/delete', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    if (!apiConfig.USE_MOCK) {
      return res.redirect('/challenges?error=Challenge deletion is not supported by the Java backend');
    }
    await challengeService.remove(req.params.id, req.session);
    res.redirect('/challenges?success=Challenge deleted');
  } catch (err) { next(err); }
});

module.exports = router;
