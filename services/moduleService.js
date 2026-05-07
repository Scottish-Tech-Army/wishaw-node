/**
 * Module Service
 * Real API endpoints:
 *   GET    /api/v1/admin/modules          -> ModuleSummaryResponse[]
 *   GET    /api/v1/admin/modules/:id      -> ModuleDetailResponse
 *   POST   /api/v1/admin/modules          -> ModuleSummaryResponse (body: {name, gameName, description})
 *   PUT    /api/v1/admin/modules/:id      -> ModuleSummaryResponse
 */
var apiConfig = require('../config/apiConfig');
var mockData = require('./mockData');
var apiClient = require('../utils/apiClient');
var nextId = mockData.modules.length + 1;

function mapModuleSummary(module) {
  return {
    id: module.id,
    name: module.name,
    gameName: module.gameName || '',
    description: module.description,
    active: module.active,
    approved: module.approved
  };
}

function mapModuleDetail(module) {
  var mapped = mapModuleSummary(module);
  mapped.challenges = module.challenges || [];
  mapped.scheduleItems = module.scheduleItems || [];
  return mapped;
}

function toLivePayload(data) {
  return {
    name: (data.name || '').trim(),
    gameName: (data.gameName || '').trim(),
    description: (data.description || '').trim()
  };
}

async function getAll(session) {
  if (!apiConfig.USE_MOCK) {
    var modules = await apiClient.get('/admin/modules', session);
    return modules.map(mapModuleSummary);
  }
  return mockData.modules;
}
async function getById(id, session) {
  if (!apiConfig.USE_MOCK) return mapModuleDetail(await apiClient.get('/admin/modules/' + id, session));
  return mockData.modules.find(function (m) { return m.id === parseInt(id); });
}
async function create(data, session) {
  if (!apiConfig.USE_MOCK) return mapModuleSummary(await apiClient.post('/admin/modules', toLivePayload(data), session));
  var mod = { id: nextId++, name: data.name, description: data.description, badgeCategory: data.badgeCategory, totalXp: parseInt(data.totalXp) || 500, active: data.active !== 'false' };
  mockData.modules.push(mod);
  return mod;
}
async function update(id, data, session) {
  if (!apiConfig.USE_MOCK) return mapModuleSummary(await apiClient.put('/admin/modules/' + id, toLivePayload(data), session));
  var mod = await getById(id);
  if (!mod) return null;
  mod.name = data.name || mod.name;
  mod.description = data.description || mod.description;
  mod.badgeCategory = data.badgeCategory || mod.badgeCategory;
  if (data.totalXp) mod.totalXp = parseInt(data.totalXp);
  if (data.active !== undefined) mod.active = data.active !== 'false';
  return mod;
}
async function remove(id, session) {
  if (!apiConfig.USE_MOCK) throw new Error('Module deletion is not supported by the live backend.');
  var idx = mockData.modules.findIndex(function (m) { return m.id === parseInt(id); });
  if (idx === -1) return false;
  mockData.modules.splice(idx, 1);
  return true;
}
module.exports = { getAll: getAll, getById: getById, create: create, update: update, remove: remove };
