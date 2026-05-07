var express = require('express');
var router = express.Router();
var { isAuthenticated } = require('../middleware/auth');
var { requireRole } = require('../middleware/roleCheck');
var scheduleService = require('../services/scheduleService');
var moduleService = require('../services/moduleService');
var centreService = require('../services/centreService');
var mockOnly = require('../utils/mockOnly');

router.use(mockOnly);

router.get('/', isAuthenticated,requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var su = req.session.user;
    var [items, centres] = await Promise.all([scheduleService.getAll(req.query.centreId, req.session), centreService.getAll(req.session)]);
    res.render('schedule/index', { title: 'Schedule', items: items, centres: centres, selectedCentreId: req.query.centreId || '', currentUser: su, success: req.query.success });
  } catch (err) { next(err); }
});

router.get('/create', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var su = req.session.user;
    var [modules, centres] = await Promise.all([moduleService.getAll(req.session), centreService.getAll(req.session)]);
    res.render('schedule/form', { title: 'Create Schedule Item', item: null, modules: modules, centres: centres, currentUser: su, error: null });
  } catch (err) { next(err); }
});

router.post('/create', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    if (!req.body.moduleId || !req.body.centreId || !req.body.dayOfWeek) {
      var su = req.session.user;
      var [modules, centres] = await Promise.all([moduleService.getAll(req.session), centreService.getAll(req.session)]);
      return res.render('schedule/form', { title: 'Create Schedule Item', item: null, modules: modules, centres: centres, currentUser: su, error: 'Module, centre, and day are required.' });
    }
    await scheduleService.create(req.body, req.session);
    res.redirect('/schedule?success=Schedule item created');
  } catch (err) { next(err); }
});

router.get('/:id/edit', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var su = req.session.user;
    var [item, modules, centres] = await Promise.all([scheduleService.getById(req.params.id, req.session), moduleService.getAll(req.session), centreService.getAll(req.session)]);
    if (!item) return res.redirect('/schedule');
    res.render('schedule/form', { title: 'Edit Schedule Item', item: item, modules: modules, centres: centres, currentUser: su, error: null });
  } catch (err) { next(err); }
});

router.post('/:id/edit', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    await scheduleService.update(req.params.id, req.body, req.session);
    res.redirect('/schedule?success=Schedule item updated');
  } catch (err) { next(err); }
});

router.post('/:id/delete', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    await scheduleService.remove(req.params.id, req.session);
    res.redirect('/schedule?success=Schedule item deleted');
  } catch (err) { next(err); }
});

module.exports = router;
