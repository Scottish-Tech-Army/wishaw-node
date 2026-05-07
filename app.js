var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var apiConfig = require('./config/apiConfig');
var csrf = require('./middleware/csrf');

var authRoutes = require('./routes/auth');
var adminRoutes = require('./routes/admin');
var centreRoutes = require('./routes/centres');
var groupRoutes = require('./routes/groups');
var playerRoutes = require('./routes/players');
var parentRoutes = require('./routes/parents');
var moduleRoutes = require('./routes/modules');
var challengeRoutes = require('./routes/challenges');
var scheduleRoutes = require('./routes/schedule');
var progressRoutes = require('./routes/progress');
var profileRoutes = require('./routes/profile');
var leaderboardRoutes = require('./routes/leaderboard');
var csvImportRoutes = require('./routes/csvImport');
var parentAreaRoutes = require('./routes/parentArea');

var app = express();

app.set('trust proxy', 1);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
  secret: apiConfig.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    secure: apiConfig.IS_PRODUCTION_LIKE ? 'auto' : false
  }
}));

app.use(csrf.ensureToken);
app.use(csrf.verifyToken);

// Make currentUser available to all views
app.use(function (req, res, next) {
  res.locals.currentUser = req.session ? req.session.user : null;
  res.locals.useMock = apiConfig.USE_MOCK;
  next();
});

// Routes
app.get('/', function (req, res) {
  if (req.session && req.session.user) {
    var role = req.session.user.role;
    if (role === 'SUPER_ADMIN' || role === 'CENTRE_ADMIN') return res.redirect('/admin/dashboard');
    if (role === 'PLAYER') return res.redirect('/profile/me');
    if (role === 'PARENT') return res.redirect('/parent/dashboard');
  }
  res.redirect('/login');
});

app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/centres', centreRoutes);
app.use('/groups', groupRoutes);
app.use('/players', playerRoutes);
app.use('/parents', parentRoutes);
app.use('/modules', moduleRoutes);
app.use('/challenges', challengeRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/progress', progressRoutes);
app.use('/profile', profileRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/import', csvImportRoutes);
app.use('/parent', parentAreaRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  var status = normaliseStatusCode(err && err.status);
  var viewError = req.app.get('env') === 'development' ? err : {};
  var pageModel = buildErrorPage(status, err, req);

  res.locals.message = pageModel.message;
  res.locals.error = viewError;
  res.status(status);
  res.render('error', {
    title: pageModel.title,
    message: pageModel.message,
    details: pageModel.details,
    actions: pageModel.actions,
    error: Object.assign({}, viewError, { status: status }),
    currentUser: req.session ? req.session.user : null
  });
});

module.exports = app;

function normaliseStatusCode(status) {
  if (!status || status < 100 || status > 599) {
    return 500;
  }
  return status;
}

function buildErrorPage(status, err, req) {
  var defaultAction = req.session && req.session.user
    ? { href: '/', label: 'Back to dashboard', className: 'btn btn-primary' }
    : { href: '/login', label: 'Go to login', className: 'btn btn-primary' };

  if (status === 404) {
    return {
      title: 'Page not found',
      message: 'That page does not exist or may have moved.',
      details: 'Check the address and try again from the main navigation.',
      actions: [defaultAction]
    };
  }

  if (status === 403) {
    return {
      title: err && err.title ? err.title : 'Access denied',
      message: err && err.message ? err.message : 'You do not have permission to access this page.',
      details: err && err.details ? err.details : 'If you believe you should have access, sign in with the right role or contact an administrator.',
      actions: err && err.actions ? err.actions : [defaultAction]
    };
  }

  if (status === 503) {
    return {
      title: err && err.title ? err.title : 'Service unavailable',
      message: err && err.message ? err.message : 'That feature is temporarily unavailable right now.',
      details: err && err.details ? err.details : 'Please try again shortly. If you are testing live mode locally, make sure the Java backend is running.',
      actions: err && err.actions ? err.actions : [defaultAction]
    };
  }

  return {
    title: apiConfig.USE_MOCK ? 'Something went wrong' : 'Live service unavailable',
    message: apiConfig.USE_MOCK
      ? (err && err.message) || 'The application hit an unexpected problem.'
      : 'The live service did not respond as expected.',
    details: apiConfig.USE_MOCK
      ? 'Please try again, or return to the previous page if the issue continues.'
      : 'Try again in a moment. If you are testing locally, confirm the backend service is running and reachable.',
    actions: [defaultAction]
  };
}
