// Role-based access control middleware
function requireRole() {
  var roles = Array.prototype.slice.call(arguments);
  return function (req, res, next) {
    if (!req.session || !req.session.user) {
      return res.redirect('/login');
    }
    if (roles.indexOf(req.session.user.role) === -1) {
      return res.status(403).render('error', {
        title: 'Access Denied',
        message: 'You do not have permission to access this page.',
        details: 'Your current role does not have access to that action. Return to a supported area or sign in with a different account.',
        actions: [
          { href: '/', label: 'Back to dashboard', className: 'btn btn-primary' }
        ],
        error: { status: 403 },
        currentUser: req.session.user
      });
    }
    next();
  };
}

module.exports = { requireRole: requireRole };
