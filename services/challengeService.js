/**
 * Challenge Service
 * Real API endpoints (FRONTEND_INTEGRATION):
 *   GET    /api/v1/admin/modules/:id        -> ModuleDetail with challenges[]
 *   POST   /api/v1/admin/modules/:id/challenges -> ChallengeSummary
 *   PUT    /api/v1/admin/challenges/:id     -> ChallengeSummary
 *   DELETE /api/v1/admin/challenges/:id     -> 204 (NOT IMPLEMENTED IN BACKEND)
 */
var apiConfig = require('../config/apiConfig');
var mockData = require('./mockData');
var apiClient = require('../utils/apiClient');
var nextId = mockData.challenges.length + 1;

function flattenChallenges(module) {
  return (module.challenges || []).map(function (challenge) {
    return {
      id: challenge.id,
      moduleId: module.id,
      moduleName: module.name,
      name: challenge.name,
      description: challenge.description,
      points: challenge.points,
      badgeCategoryId: challenge.badgeCategoryId,
      badgeCategoryName: challenge.badgeCategoryName,
      active: challenge.active
    };
  });
}

async function getAll(moduleId, session) {
  if (!apiConfig.USE_MOCK) {
    if (moduleId) {
      return flattenChallenges(await apiClient.get('/admin/modules/' + moduleId, session));
    }

    var modules = await apiClient.get('/admin/modules', session);
    var details = await Promise.all(modules.map(function (module) {
      return apiClient.get('/admin/modules/' + module.id, session);
    }));

    return details.flatMap(flattenChallenges);
  }
  if (moduleId) return mockData.challenges.filter(function (c) { return c.moduleId === parseInt(moduleId); });
  return mockData.challenges;
}
async function getById(id, session) {
  if (!apiConfig.USE_MOCK) {
    var challenges = await getAll(null, session);
    return challenges.find(function (challenge) { return challenge.id === parseInt(id); }) || null;
  }
  return mockData.challenges.find(function (c) { return c.id === parseInt(id); });
}
async function create(data, session) {
  if (!apiConfig.USE_MOCK) return apiClient.post('/admin/modules/' + data.moduleId + '/challenges', { name: data.name, description: data.description, points: parseInt(data.points) || 0, badgeCategory: data.badgeCategory, skills: data.skills ? data.skills.split(',').map(function (s) { return s.trim(); }) : [] }, session);
  var ch = {
    id: nextId++, moduleId: parseInt(data.moduleId), name: data.name, description: data.description,
    points: parseInt(data.points) || 0, badgeCategory: data.badgeCategory,
    skills: data.skills ? data.skills.split(',').map(function (s) { return s.trim(); }) : []
  };
  mockData.challenges.push(ch);
  return ch;
}
async function update(id, data, session) {
  if (!apiConfig.USE_MOCK) return apiClient.put('/admin/challenges/' + id, data, session);
  var ch = await getById(id);
  if (!ch) return null;
  ch.name = data.name || ch.name;
  ch.description = data.description || ch.description;
  if (data.moduleId) ch.moduleId = parseInt(data.moduleId);
  if (data.points) ch.points = parseInt(data.points);
  ch.badgeCategory = data.badgeCategory || ch.badgeCategory;
  if (data.skills) ch.skills = data.skills.split(',').map(function (s) { return s.trim(); });
  return ch;
}
async function remove(id, session) {
  // DELETE not implemented in backend yet - will fail in live mode
  if (!apiConfig.USE_MOCK) return apiClient.del('/admin/challenges/' + id, session);
  var idx = mockData.challenges.findIndex(function (c) { return c.id === parseInt(id); });
  if (idx === -1) return false;
  mockData.challenges.splice(idx, 1);
  return true;
}
module.exports = { getAll: getAll, getById: getById, create: create, update: update, remove: remove };
