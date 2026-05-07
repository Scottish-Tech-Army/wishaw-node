// Guard middleware: blocks a route in real backend mode (USE_MOCK=false).
// Usage: router.use(mockOnly); at the top of any mock-only router.
var apiConfig = require('../config/apiConfig');

function mockOnly(req, res, next) {
  if (apiConfig.USE_MOCK) return next();
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  res.status(503).render('error', {
    title: 'Live mode only supports the connected service',
    message: 'This area is intentionally unavailable while the app is running against the live backend.',
    details: 'It depends on mock-only features that are useful for demos and local testing, but are not part of the integrated live flow yet.',
    actions: [
      { href: '/admin/dashboard', label: 'Back to dashboard', className: 'btn btn-primary' },
      { href: '/centres', label: 'Browse supported areas', className: 'btn btn-secondary' }
    ],
    error: { status: 503 },
    currentUser: req.session ? req.session.user : null
  });
}

module.exports = mockOnly;
