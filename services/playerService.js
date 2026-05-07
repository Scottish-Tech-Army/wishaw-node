/**
 * Player Service
 * Real API endpoints (FRONTEND_INTEGRATION):
 *   GET    /api/v1/players                     -> PlayerSummary[]
 *   GET    /api/v1/players/:id                 -> PlayerSummary
 *   POST   /api/v1/players                     -> PlayerSummary  (body: {displayName, externalRef, email, groupId, centreId, active})
 *   PUT    /api/v1/players/:id                 -> PlayerSummary
 *   PATCH  /api/v1/players/:id/toggle-active   -> PlayerSummary
 *   DELETE /api/v1/players/:id                 -> 204
 */
var apiConfig = require('../config/apiConfig');
var mockData = require('./mockData');
var apiClient = require('../utils/apiClient');
var playerMediaStore = require('../utils/playerMediaStore');
var nextId = mockData.players.length + 1;

function mapPlayer(user, pointsByPlayerId) {
  return {
    id: user.id,
    username: user.username,
    email: user.username,
    displayName: user.displayName,
    externalRef: user.externalRef || '',
    groupId: user.groupId,
    groupName: user.groupName,
    centreId: user.centreId,
    centreName: user.centreName,
    active: user.active,
    xp: pointsByPlayerId && pointsByPlayerId[user.id] ? pointsByPlayerId[user.id] : 0,
    avatarUrl: user.avatarUrl || null,
    imageUrl: user.imageUrl || null
  };
}

async function getPlayersFromBackend(session) {
  var users = await apiClient.get('/admin/users', session);
  var pointsByPlayerId = {};

  try {
    var leaderboard = await apiClient.get('/leaderboards/global', session);
    leaderboard.forEach(function (entry) {
      pointsByPlayerId[entry.playerId] = entry.totalPoints || 0;
    });
  } catch (_) {
    pointsByPlayerId = {};
  }

  return users
    .filter(function (user) { return user.role === 'PLAYER'; })
    .map(function (user) { return mapPlayer(user, pointsByPlayerId); });
}

async function getAll(session) {
  if (!apiConfig.USE_MOCK) return playerMediaStore.applyToPlayers(await getPlayersFromBackend(session));
  return playerMediaStore.applyToPlayers(mockData.players);
}
async function getById(id, session) {
  if (!apiConfig.USE_MOCK) {
    var user = await apiClient.get('/admin/users/' + id, session);
    if (!user || user.role !== 'PLAYER') return null;
    var players = await getPlayersFromBackend(session);
    return playerMediaStore.applyToPlayer(players.find(function (player) { return player.id === parseInt(id); }) || mapPlayer(user, {}));
  }
  return playerMediaStore.applyToPlayer(mockData.players.find(function (p) { return p.id === parseInt(id); }));
}
async function create(data, session) {
  if (!apiConfig.USE_MOCK) {
    return playerMediaStore.applyToPlayer(mapPlayer(await apiClient.post('/admin/users', {
      username: data.username,
      password: data.password,
      displayName: data.displayName,
      role: 'PLAYER',
      groupId: parseInt(data.groupId),
      centreId: parseInt(data.centreId),
      externalRef: data.externalRef || ''
    }, session), {}));
  }
  var group = mockData.groups.find(function (g) { return g.id === parseInt(data.groupId); });
  var centre = mockData.centres.find(function (c) { return c.id === parseInt(data.centreId); });
  var player = {
    id: nextId++, displayName: data.displayName, externalRef: data.externalRef || '',
    email: data.email || '', groupId: parseInt(data.groupId), groupName: group ? group.name : '',
    centreId: parseInt(data.centreId), centreName: centre ? centre.name : '',
    active: data.active !== 'false', xp: 0, avatarUrl: null, imageUrl: null
  };
  mockData.players.push(player);
  return playerMediaStore.applyToPlayer(player);
}
async function update(id, data, session) {
  if (!apiConfig.USE_MOCK) {
    return playerMediaStore.applyToPlayer(mapPlayer(await apiClient.put('/admin/users/' + id, {
      displayName: data.displayName,
      role: 'PLAYER',
      groupId: parseInt(data.groupId),
      centreId: parseInt(data.centreId),
      externalRef: data.externalRef || ''
    }, session), {}));
  }
  var player = mockData.players.find(function (item) { return item.id === parseInt(id); });
  if (!player) return null;
  player.displayName = data.displayName || player.displayName;
  player.externalRef = data.externalRef !== undefined ? data.externalRef : player.externalRef;
  player.email = data.email !== undefined ? data.email : player.email;
  if (data.groupId) {
    var group = mockData.groups.find(function (g) { return g.id === parseInt(data.groupId); });
    player.groupId = parseInt(data.groupId); player.groupName = group ? group.name : '';
  }
  if (data.centreId) {
    var centre = mockData.centres.find(function (c) { return c.id === parseInt(data.centreId); });
    player.centreId = parseInt(data.centreId); player.centreName = centre ? centre.name : '';
  }
  if (data.active !== undefined) player.active = data.active !== 'false';
  return playerMediaStore.applyToPlayer(player);
}
async function toggleActive(id, session) {
  if (!apiConfig.USE_MOCK) {
    var player = await getById(id, session);
    if (!player) return null;
    return playerMediaStore.applyToPlayer(mapPlayer(await apiClient.patch('/admin/users/' + id + '/status', { active: !player.active }, session), {}));
  }
  var player = mockData.players.find(function (item) { return item.id === parseInt(id); });
  if (!player) return null;
  player.active = !player.active;
  return playerMediaStore.applyToPlayer(player);
}
async function saveImage(id, file, mediaType, session) {
  var playerId = parseInt(id);
  var player = await getById(playerId, session);

  if (!player) {
    var notFoundError = new Error('That player could not be found.');
    notFoundError.status = 404;
    throw notFoundError;
  }

  var media = await playerMediaStore.savePlayerMedia(playerId, file, mediaType);

  if (apiConfig.USE_MOCK) {
    var mockPlayer = mockData.players.find(function (item) { return item.id === playerId; });
    if (mockPlayer) {
      mockPlayer.avatarUrl = media.avatarUrl || null;
      mockPlayer.imageUrl = media.imageUrl || null;
    }
  }

  return playerMediaStore.applyToPlayer(Object.assign({}, player, {
    avatarUrl: media.avatarUrl || player.avatarUrl || null,
    imageUrl: media.imageUrl || player.imageUrl || null
  }));
}
async function remove(id, session) {
  if (!apiConfig.USE_MOCK) return false;
  var idx = mockData.players.findIndex(function (p) { return p.id === parseInt(id); });
  if (idx === -1) return false;
  mockData.players.splice(idx, 1);
  await playerMediaStore.removePlayerMedia(parseInt(id));
  return true;
}
module.exports = { getAll: getAll, getById: getById, create: create, update: update, toggleActive: toggleActive, saveImage: saveImage, remove: remove };
