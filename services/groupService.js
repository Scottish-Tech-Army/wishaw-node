/**
 * Group Service
 * Real API endpoints (FRONTEND_INTEGRATION):
 *   GET    /api/v1/groups?centreId= -> GroupSummary[]
 *   GET    /api/v1/groups/:id       -> GroupSummary
 *   POST   /api/v1/groups           -> GroupSummary  (body: {name, centreId, ageRange})
 *   PUT    /api/v1/groups/:id       -> GroupSummary
 *   DELETE /api/v1/groups/:id       -> 204
 */
var apiConfig = require('../config/apiConfig');
var mockData = require('./mockData');
var apiClient = require('../utils/apiClient');
var nextId = mockData.groups.length + 1;

function mapGroup(group) {
  return {
    id: group.id,
    name: group.name,
    gameName: group.gameName || '',
    centreId: group.centreId,
    centreName: group.centreName,
    ageBand: group.ageBand || '',
    ageRange: group.ageBand || '',
    active: group.active
  };
}

async function getAll(centreId, session) {
  if (!apiConfig.USE_MOCK) {
    var groups = await apiClient.get('/admin/groups', session);
    var mappedGroups = groups.map(mapGroup);
    if (centreId) {
      return mappedGroups.filter(function (g) { return g.centreId === parseInt(centreId); });
    }
    return mappedGroups;
  }
  if (centreId) return mockData.groups.filter(function (g) { return g.centreId === parseInt(centreId); });
  return mockData.groups;
}
async function getById(id, session) {
  if (!apiConfig.USE_MOCK) {
    var groups = await getAll(null, session);
    return groups.find(function (g) { return g.id === parseInt(id); }) || null;
  }
  return mockData.groups.find(function (g) { return g.id === parseInt(id); });
}
async function create(data, session) {
  if (!apiConfig.USE_MOCK) {
    return mapGroup(await apiClient.post('/admin/groups', {
      name: data.name,
      centreId: parseInt(data.centreId),
      gameName: data.gameName || '',
      ageBand: data.ageBand || data.ageRange || ''
    }, session));
  }
  var centre = mockData.centres.find(function (c) { return c.id === parseInt(data.centreId); });
  var group = { id: nextId++, name: data.name, centreId: parseInt(data.centreId), centreName: centre ? centre.name : '', ageRange: data.ageRange };
  mockData.groups.push(group);
  return group;
}
async function update(id, data, session) {
  if (!apiConfig.USE_MOCK) {
    return mapGroup(await apiClient.put('/admin/groups/' + id, {
      name: data.name,
      centreId: parseInt(data.centreId),
      gameName: data.gameName || '',
      ageBand: data.ageBand || data.ageRange || ''
    }, session));
  }
  var group = await getById(id);
  if (!group) return null;
  var centre = mockData.centres.find(function (c) { return c.id === parseInt(data.centreId); });
  group.name = data.name || group.name;
  if (data.centreId) { group.centreId = parseInt(data.centreId); group.centreName = centre ? centre.name : ''; }
  group.ageRange = data.ageRange || group.ageRange;
  return group;
}
async function remove(id, session) {
  if (!apiConfig.USE_MOCK) return false;
  var idx = mockData.groups.findIndex(function (g) { return g.id === parseInt(id); });
  if (idx === -1) return false;
  mockData.groups.splice(idx, 1);
  return true;
}
module.exports = { getAll: getAll, getById: getById, create: create, update: update, remove: remove };
