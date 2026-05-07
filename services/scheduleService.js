/**
 * Schedule Service
 * Real API endpoints (FRONTEND_INTEGRATION):
 *   GET    /api/v1/schedule?centreId=  -> ScheduleItem[]
 *   GET    /api/v1/schedule/:id        -> ScheduleItem
 *   POST   /api/v1/schedule            -> ScheduleItem  (body: {moduleId, centreId, dayOfWeek, startTime, endTime})
 *   PUT    /api/v1/schedule/:id        -> ScheduleItem
 *   DELETE /api/v1/schedule/:id        -> 204
 */
var apiConfig = require('../config/apiConfig');
var mockData = require('./mockData');
var apiClient = require('../utils/apiClient');
var nextId = mockData.schedule.length + 1;

async function getAll(centreId, session) {
  if (!apiConfig.USE_MOCK) {
    var path = centreId ? '/schedule?centreId=' + centreId : '/schedule';
    return apiClient.get(path, session);
  }
  if (centreId) return mockData.schedule.filter(function (s) { return s.centreId === parseInt(centreId); });
  return mockData.schedule;
}
async function getById(id, session) {
  if (!apiConfig.USE_MOCK) return apiClient.get('/schedule/' + id, session);
  return mockData.schedule.find(function (s) { return s.id === parseInt(id); });
}
async function create(data, session) {
  if (!apiConfig.USE_MOCK) return apiClient.post('/schedule', { moduleId: parseInt(data.moduleId), centreId: parseInt(data.centreId), dayOfWeek: data.dayOfWeek, startTime: data.startTime, endTime: data.endTime }, session);
  var mod = mockData.modules.find(function (m) { return m.id === parseInt(data.moduleId); });
  var centre = mockData.centres.find(function (c) { return c.id === parseInt(data.centreId); });
  var item = {
    id: nextId++, moduleId: parseInt(data.moduleId), moduleName: mod ? mod.name : '',
    dayOfWeek: data.dayOfWeek, startTime: data.startTime, endTime: data.endTime,
    centreId: parseInt(data.centreId), centreName: centre ? centre.name : ''
  };
  mockData.schedule.push(item);
  return item;
}
async function update(id, data, session) {
  if (!apiConfig.USE_MOCK) return apiClient.put('/schedule/' + id, data, session);
  var item = await getById(id);
  if (!item) return null;
  if (data.moduleId) { var mod = mockData.modules.find(function (m) { return m.id === parseInt(data.moduleId); }); item.moduleId = parseInt(data.moduleId); item.moduleName = mod ? mod.name : ''; }
  item.dayOfWeek = data.dayOfWeek || item.dayOfWeek;
  item.startTime = data.startTime || item.startTime;
  item.endTime = data.endTime || item.endTime;
  if (data.centreId) { var centre = mockData.centres.find(function (c) { return c.id === parseInt(data.centreId); }); item.centreId = parseInt(data.centreId); item.centreName = centre ? centre.name : ''; }
  return item;
}
async function remove(id, session) {
  if (!apiConfig.USE_MOCK) return apiClient.del('/schedule/' + id, session);
  var idx = mockData.schedule.findIndex(function (s) { return s.id === parseInt(id); });
  if (idx === -1) return false;
  mockData.schedule.splice(idx, 1);
  return true;
}
module.exports = { getAll: getAll, getById: getById, create: create, update: update, remove: remove };
