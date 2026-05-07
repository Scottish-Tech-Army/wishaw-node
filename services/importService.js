var apiClient = require('../utils/apiClient');

async function uploadCsv(file, session) {
  return apiClient.postMultipart('/admin/import/csv/upload', {}, {
    fieldName: 'file',
    filename: file.originalname || 'import.csv',
    contentType: file.mimetype || 'text/csv',
    buffer: file.buffer
  }, session);
}

async function getPreview(batchId, session) {
  return apiClient.get('/admin/import/' + batchId + '/preview', session);
}

async function mapPlayers(batchId, playerMappings, session) {
  return apiClient.post('/admin/import/' + batchId + '/map-players', {
    playerMappings: playerMappings || {}
  }, session);
}

async function getReport(batchId, session) {
  return apiClient.get('/admin/import/' + batchId + '/report', session);
}

async function commit(batchId, session) {
  return apiClient.post('/admin/import/' + batchId + '/commit', null, session);
}

module.exports = {
  uploadCsv: uploadCsv,
  getPreview: getPreview,
  mapPlayers: mapPlayers,
  getReport: getReport,
  commit: commit
};
