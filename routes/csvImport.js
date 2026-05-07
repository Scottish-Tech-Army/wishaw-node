var express = require('express');
var router = express.Router();
var multer = require('multer');
var { isAuthenticated } = require('../middleware/auth');
var { requireRole } = require('../middleware/roleCheck');
var apiConfig = require('../config/apiConfig');
var importService = require('../services/importService');
var playerService = require('../services/playerService');

var upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

function getErrorMessage(err, fallback) {
  if (err && err.body) {
    if (typeof err.body === 'string') return err.body;
    if (err.body.message) return err.body.message;
    if (err.body.error) return err.body.error;
  }
  return err && err.message ? err.message : fallback;
}

function renderImport(res, req, title, step, data, success, error) {
  res.render('import/csv', {
    title: title,
    step: step,
    data: data,
    currentUser: req.session.user,
    success: success || null,
    error: error || null
  });
}

function getUploadFile(req) {
  if (req.file && req.file.buffer && req.file.buffer.length) return req.file;
  if (req.body.csvText && req.body.csvText.trim()) {
    return {
      originalname: 'import.csv',
      mimetype: 'text/csv',
      buffer: Buffer.from(req.body.csvText, 'utf8')
    };
  }
  return null;
}

function parseRowData(rawData) {
  if (!rawData) return {};
  try {
    return JSON.parse(rawData);
  } catch (_) {
    return {};
  }
}

function getRowValue(rowData, candidates) {
  for (var index = 0; index < candidates.length; index++) {
    if (rowData[candidates[index]]) {
      return rowData[candidates[index]];
    }
  }
  return '';
}

function formatPlayerOption(player) {
  var username = player.username || player.email || 'unknown';
  var locationBits = [];

  if (player.centreName) locationBits.push(player.centreName);
  if (player.groupName) locationBits.push(player.groupName);

  return {
    id: player.id,
    label: player.displayName + ' (' + username + ')' + (locationBits.length ? ' - ' + locationBits.join(' / ') : '')
  };
}

async function buildLivePreviewData(preview, session, selectedMappings) {
  var unmappedPlayers = preview.unmappedPlayers || [];
  var playerOptions = [];

  if (unmappedPlayers.length > 0) {
    playerOptions = (await playerService.getAll(session))
      .sort(function (left, right) {
        return String(left.displayName || '').localeCompare(String(right.displayName || ''));
      })
      .map(formatPlayerOption);
  }

  return {
    mode: 'live',
    preview: preview,
    rows: (preview.rows || []).map(function (row) {
      var parsed = parseRowData(row.rawData);
      return Object.assign({}, row, {
        parsed: parsed,
        username: getRowValue(parsed, ['username', 'playerUsername', 'player']),
        badgeCategoryCode: getRowValue(parsed, ['badgeCategoryCode', 'category', 'badge']),
        challengePoints: getRowValue(parsed, ['challengePoints', 'points', 'awardPoints']),
        legacyPoints: getRowValue(parsed, ['legacyPoints', 'legacy'])
      });
    }),
    unmappedPlayers: unmappedPlayers,
    playerOptions: playerOptions,
    selectedMappings: selectedMappings || {}
  };
}

async function renderLivePreview(res, req, preview, success, error, selectedMappings) {
  var data = await buildLivePreviewData(preview, req.session, selectedMappings);
  renderImport(res, req, 'CSV Import - Preview', 2, data, success, error);
}

function extractPlayerMappings(body) {
  var mappings = {};

  Object.keys(body || {}).forEach(function (key) {
    if (key.indexOf('mappingKey_') !== 0) return;

    var suffix = key.substring('mappingKey_'.length);
    var username = body[key];
    var mappedUserId = parseInt(body['mappingValue_' + suffix], 10);

    if (username && !isNaN(mappedUserId)) {
      mappings[username] = mappedUserId;
    }
  });

  return mappings;
}

router.get('/', isAuthenticated, requireRole('SUPER_ADMIN'), function (req, res) {
  renderImport(res, req, 'CSV Import', 1, null, null, null);
});

router.post('/upload', isAuthenticated, requireRole('SUPER_ADMIN'), upload.single('csvFile'), async function (req, res, next) {
  if (!apiConfig.USE_MOCK) {
    try {
      var file = getUploadFile(req);
      if (!file) {
        return renderImport(res, req, 'CSV Import', 1, null, null, 'No CSV data provided');
      }
      var preview = await importService.uploadCsv(file, req.session);
      return renderLivePreview(res, req, preview, null, null, {});
    } catch (err) {
      return renderImport(res, req, 'CSV Import', 1, null, null, getErrorMessage(err, 'Failed to upload CSV.'));
    }
  }
  try {
    var content = '';
    if (req.file) {
      content = req.file.buffer.toString('utf8');
    } else if (req.body.csvText) {
      content = req.body.csvText;
    }
    if (!content.trim()) {
      return res.render('import/csv', { title: 'CSV Import', step: 1, data: null, currentUser: req.session.user, success: null, error: 'No data provided' });
    }
    var lines = content.trim().split('\n');
    if (lines.length < 2) {
      return res.render('import/csv', { title: 'CSV Import', step: 1, data: null, currentUser: req.session.user, success: null, error: 'CSV must have a header row and at least one data row' });
    }
    var headers = lines[0].split(',').map(function (h) { return h.trim(); });
    var allPlayers = await playerService.getAll(req.session);
    var rows = [];
    for (var i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      var cols = lines[i].split(',').map(function (c) { return c.trim(); });
      var row = {};
      headers.forEach(function (h, idx) { row[h] = cols[idx] || ''; });
      row._errors = [];
      if (!row.displayName) row._errors.push('Missing display name');
      if (!row.externalRef) row._errors.push('Missing external reference');
      var existing = allPlayers.find(function (p) { return p.externalRef === row.externalRef; });
      row._status = existing ? 'UPDATE' : 'CREATE';
      row._existingPlayer = existing || null;
      rows.push(row);
    }
    renderImport(res, req, 'CSV Import - Preview', 2, { mode: 'mock', headers: headers, rows: rows }, null, null);
  } catch (e) {
    renderImport(res, req, 'CSV Import', 1, null, null, 'Failed to parse CSV: ' + e.message);
  }
});

router.post('/map-players', isAuthenticated, requireRole('SUPER_ADMIN'), async function (req, res) {
  if (apiConfig.USE_MOCK) {
    return res.redirect('/import');
  }

  var batchId = parseInt(req.body.batchId, 10);
  var selectedMappings = extractPlayerMappings(req.body);

  if (!batchId) {
    return renderImport(res, req, 'CSV Import', 1, null, null, 'Import batch ID is missing. Please upload the CSV again.');
  }

  try {
    if (!Object.keys(selectedMappings).length) {
      var currentPreview = await importService.getPreview(batchId, req.session);
      return renderLivePreview(res, req, currentPreview, null, 'Choose at least one player mapping before saving.', selectedMappings);
    }

    var preview = await importService.mapPlayers(batchId, selectedMappings, req.session);
    return renderLivePreview(res, req, preview, 'Player mappings updated.', null, selectedMappings);
  } catch (err) {
    try {
      var fallbackPreview = await importService.getPreview(batchId, req.session);
      return renderLivePreview(res, req, fallbackPreview, null, getErrorMessage(err, 'Failed to save player mappings.'), selectedMappings);
    } catch (_) {
      return renderImport(res, req, 'CSV Import', 1, null, null, getErrorMessage(err, 'Failed to save player mappings.'));
    }
  }
});

router.post('/commit', isAuthenticated, requireRole('SUPER_ADMIN'), async function (req, res, next) {
  if (!apiConfig.USE_MOCK) {
    var batchId = parseInt(req.body.batchId, 10);

    try {
      if (!batchId) {
        return renderImport(res, req, 'CSV Import', 1, null, null, 'Import batch ID is missing. Please upload the CSV again.');
      }

      var preview = await importService.getPreview(batchId, req.session);
      if (preview.unmappedPlayers && preview.unmappedPlayers.length > 0) {
        return renderLivePreview(
          res,
          req,
          preview,
          null,
          'Map every unresolved username to an existing player before committing this batch.',
          {}
        );
      }

      var result = await importService.commit(batchId, req.session);
      var report = await importService.getReport(batchId, req.session);
      return renderImport(
        res,
        req,
        'CSV Import - Complete',
        3,
        { mode: 'live', result: result, report: report },
        result.message,
        null
      );
    } catch (err) {
      try {
        if (batchId) {
          var currentPreview = await importService.getPreview(batchId, req.session);
          return renderLivePreview(res, req, currentPreview, null, getErrorMessage(err, 'Failed to commit import.'), {});
        }
      } catch (_) {
        // fall through to generic error rendering below
      }
      return renderImport(res, req, 'CSV Import', 1, null, null, getErrorMessage(err, 'Failed to commit import.'));
    }
  }
  try {
    var created = 0, updated = 0, skipped = 0;
    var rows = JSON.parse(req.body.rowsJson || '[]');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (row._errors && row._errors.length > 0) { skipped++; continue; }
      if (row._status === 'UPDATE' && row._existingPlayer) {
        await playerService.update(row._existingPlayer.id, row, req.session);
        updated++;
      } else {
        await playerService.create(row, req.session);
        created++;
      }
    }
    renderImport(
      res,
      req,
      'CSV Import - Complete',
      3,
      { mode: 'mock', created: created, updated: updated, skipped: skipped },
      'Import complete: ' + created + ' created, ' + updated + ' updated, ' + skipped + ' skipped.',
      null
    );
  } catch (err) { next(err); }
});

module.exports = router;
