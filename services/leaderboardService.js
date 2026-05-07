/**
 * Leaderboard Service
 * Real API endpoints (FRONTEND_INTEGRATION):
 *   GET /api/v1/leaderboard?scope=global               -> LeaderboardEntry[]
 *   GET /api/v1/leaderboard?scope=centre&scopeId=:id   -> LeaderboardEntry[]
 *   GET /api/v1/leaderboard?scope=group&scopeId=:id    -> LeaderboardEntry[]
 */
var apiConfig = require('../config/apiConfig');
var mockData = require('./mockData');
var apiClient = require('../utils/apiClient');
var playerMediaStore = require('../utils/playerMediaStore');

async function getLeaderboard(scope, scopeId, session) {
  if (!apiConfig.USE_MOCK) {
    var path = '/leaderboards/global';
    if (scope === 'centre') {
      if (!scopeId) return [];
      path = '/leaderboards/centre/' + scopeId;
    } else if (scope === 'group') {
      if (!scopeId) return [];
      path = '/leaderboards/group/' + scopeId;
    }

    var entries = await apiClient.get(path, session);
    return playerMediaStore.applyToPlayers(entries.map(function (entry) {
      return {
        rank: entry.rank,
        playerId: entry.playerId,
        id: entry.playerId,
        displayName: entry.displayName,
        groupName: entry.groupName,
        centreName: entry.centreName,
        xp: entry.totalPoints || 0,
        highestLevel: entry.highestLevel
      };
    }));
  }
  var players = mockData.players.filter(function (p) { return p.active; });
  if (scope === 'centre' && scopeId) players = players.filter(function (p) { return p.centreId === parseInt(scopeId); });
  if (scope === 'group' && scopeId) players = players.filter(function (p) { return p.groupId === parseInt(scopeId); });
  return playerMediaStore.applyToPlayers(players.sort(function (a, b) { return b.xp - a.xp; }).map(function (p, i) {
    return { rank: i + 1, playerId: p.id, id: p.id, displayName: p.displayName, groupName: p.groupName, centreName: p.centreName, xp: p.xp, avatarUrl: p.avatarUrl || null, imageUrl: p.imageUrl || null };
  }));
}

module.exports = { getLeaderboard: getLeaderboard };
