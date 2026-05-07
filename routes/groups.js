var express = require('express');
var router = express.Router();
var { isAuthenticated } = require('../middleware/auth');
var { requireRole } = require('../middleware/roleCheck');
var apiConfig = require('../config/apiConfig');
var groupService = require('../services/groupService');
var centreService = require('../services/centreService');

router.get('/', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var su = req.session.user;
    var [groups, centres] = await Promise.all([groupService.getAll(req.query.centreId, req.session), centreService.getAll(req.session)]);
    res.render('groups/index', { title: 'Groups', groups: groups, centres: centres, selectedCentreId: req.query.centreId || '', currentUser: su, success: req.query.success, error: req.query.error || null });
  } catch (err) { next(err); }
});

router.get('/create', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var centres = await centreService.getAll(req.session);
    res.render('groups/form', { title: 'Create Group', group: null, centres: centres, currentUser: req.session.user, error: null });
  } catch (err) { next(err); }
});

router.post('/create', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var name = (req.body.name || '').trim();
    if (!name) {
      var centres = await centreService.getAll(req.session);
      return res.render('groups/form', { title: 'Create Group', group: null, centres: centres, currentUser: req.session.user, error: 'Name is required.' });
    }
    await groupService.create(req.body, req.session);
    res.redirect('/groups?success=Group created successfully');
  } catch (err) { next(err); }
});

router.get('/:id/edit', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    var su = req.session.user;
    var [group, centres] = await Promise.all([groupService.getById(req.params.id, req.session), centreService.getAll(req.session)]);
    if (!group) return res.redirect('/groups');
    res.render('groups/form', { title: 'Edit Group', group: group, centres: centres, currentUser: su, error: null });
  } catch (err) { next(err); }
});

router.post('/:id/edit', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    await groupService.update(req.params.id, req.body, req.session);
    res.redirect('/groups?success=Group updated successfully');
  } catch (err) { next(err); }
});

router.post('/:id/delete', isAuthenticated, requireRole('SUPER_ADMIN', 'CENTRE_ADMIN'), async function (req, res, next) {
  try {
    if (!apiConfig.USE_MOCK) {
      return res.redirect('/groups?error=Deleting groups is not supported by the Java backend');
    }
    await groupService.remove(req.params.id, req.session);
    res.redirect('/groups?success=Group deleted');
  } catch (err) { next(err); }
});

module.exports = router;
