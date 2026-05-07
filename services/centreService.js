/**
 * Centre Service
 * Mock: in-memory CRUD
 * Real API endpoints (FRONTEND_INTEGRATION):
 *   GET    /api/v1/centres          -> CentreSummary[]
 *   GET    /api/v1/centres/:id      -> CentreSummary
 *   POST   /api/v1/centres          -> CentreSummary  (body: {name, location, active})
 *   PUT    /api/v1/centres/:id      -> CentreSummary
 *   DELETE /api/v1/centres/:id      -> 204
 */
var apiConfig = require('../config/apiConfig');
var mockData = require('./mockData');
var apiClient = require('../utils/apiClient');
var nextId = mockData.centres.length + 1;

function mapCentre(centre) {
  return {
    id: centre.id,
    name: centre.name,
    code: centre.code,
    location: centre.code,
    active: centre.active
  };
}

async function getAll(session) {
  if (!apiConfig.USE_MOCK) {
    var centres = await apiClient.get('/admin/centres', session);
    return centres.map(mapCentre);
  }
  return mockData.centres;
}

async function getById(id, session) {
  if (!apiConfig.USE_MOCK) {
    var centres = await getAll(session);
    return centres.find(function (c) { return c.id === parseInt(id); }) || null;
  }
  return mockData.centres.find(function (c) { return c.id === parseInt(id); });
}

async function create(data, session) {
  if (!apiConfig.USE_MOCK) {
    return mapCentre(await apiClient.post('/admin/centres', {
      name: data.name,
      code: data.code
    }, session));
  }
  var centre = { id: nextId++, name: data.name, location: data.location, active: data.active !== 'false' };
  mockData.centres.push(centre);
  return centre;
}

async function update(id, data, session) {
  if (!apiConfig.USE_MOCK) {
    return mapCentre(await apiClient.put('/admin/centres/' + id, {
      name: data.name,
      code: data.code
    }, session));
  }
  var centre = await getById(id);
  if (!centre) return null;
  centre.name = data.name || centre.name;
  centre.location = data.location || centre.location;
  if (data.active !== undefined) centre.active = data.active !== 'false';
  return centre;
}

async function remove(id, session) {
  if (!apiConfig.USE_MOCK) return false;
  var idx = mockData.centres.findIndex(function (c) { return c.id === parseInt(id); });
  if (idx === -1) return false;
  mockData.centres.splice(idx, 1);
  return true;
}

module.exports = { getAll: getAll, getById: getById, create: create, update: update, remove: remove };
