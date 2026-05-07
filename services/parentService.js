/**
 * Parent Service
 * Real API endpoints (FRONTEND_INTEGRATION):
 *   GET    /api/v1/parent-links                -> ParentLink[]
 *   GET    /api/v1/parent-links?parentId=      -> ParentLink[]
 *   POST   /api/v1/parent-links                -> ParentLink  (body: {parentId, playerId})
 *   DELETE /api/v1/parent-links/:id            -> 204
 */
var apiConfig = require('../config/apiConfig');
var mockData = require('./mockData');
var apiClient = require('../utils/apiClient');
var progressService = require('./progressService');
var playerMediaStore = require('../utils/playerMediaStore');
var nextId = mockData.parentLinks.length + 1;

function mapLinkedPlayer(player) {
  return {
    id: player.id,
    displayName: player.displayName,
    groupName: player.groupName,
    centreName: player.centreName,
    xp: player.totalPoints || player.xp || 0,
    avatarUrl: player.avatarUrl || null,
    imageUrl: player.imageUrl || null
  };
}

function mapProfile(profile) {
  return {
    id: profile.id,
    username: profile.username,
    displayName: profile.displayName,
    centreName: profile.centreName,
    groupName: profile.groupName,
    active: true,
    avatarUrl: profile.avatarUrl || null,
    imageUrl: profile.imageUrl || null
  };
}

async function getAll(session) {
  if (!apiConfig.USE_MOCK) return [];
  return mockData.parentLinks;
}
async function create(data, session) {
  if (!apiConfig.USE_MOCK) {
    return apiClient.post('/admin/parents/link-player', {
      parentUserId: parseInt(data.parentId),
      playerUserId: parseInt(data.playerId),
      relationshipLabel: data.relationshipLabel || 'Parent'
    }, session);
  }
  var parent = mockData.users.find(function (u) { return u.id === parseInt(data.parentId) && u.role === 'PARENT'; });
  var player = mockData.players.find(function (p) { return p.id === parseInt(data.playerId); });
  if (!parent || !player) return null;
  var link = { id: nextId++, parentId: parseInt(data.parentId), parentName: parent.displayName, parentEmail: parent.email, playerId: parseInt(data.playerId), playerName: player.displayName };
  mockData.parentLinks.push(link);
  return link;
}
async function remove(id, session) {
  if (!apiConfig.USE_MOCK) return false;
  var idx = mockData.parentLinks.findIndex(function (l) { return l.id === parseInt(id); });
  if (idx === -1) return false;
  mockData.parentLinks.splice(idx, 1);
  return true;
}
async function getByParentId(parentId, session) {
  if (!apiConfig.USE_MOCK) {
    var players = await apiClient.get('/parent/players', session);
    return players.map(function (player) {
      return {
        playerId: player.id,
        playerName: player.displayName,
        groupName: player.groupName,
        centreName: player.centreName
      };
    });
  }
  return mockData.parentLinks.filter(function (l) { return l.parentId === parseInt(parentId); });
}

async function getLinkedPlayers(session) {
  if (!apiConfig.USE_MOCK) {
    var players = await apiClient.get('/parent/players', session);
    return playerMediaStore.applyToPlayers(players.map(mapLinkedPlayer));
  }
  return [];
}

async function getLinkedPlayerProfile(playerId, session) {
  if (!apiConfig.USE_MOCK) return playerMediaStore.applyToPlayer(mapProfile(await apiClient.get('/parent/players/' + playerId + '/profile', session)));
  return null;
}

async function getLinkedPlayerProgress(playerId, session) {
  if (!apiConfig.USE_MOCK) return progressService.normaliseProgressList(await apiClient.get('/parent/players/' + playerId + '/progress', session));
  return null;
}

module.exports = {
  getAll: getAll,
  create: create,
  remove: remove,
  getByParentId: getByParentId,
  getLinkedPlayers: getLinkedPlayers,
  getLinkedPlayerProfile: getLinkedPlayerProfile,
  getLinkedPlayerProgress: getLinkedPlayerProgress
};
