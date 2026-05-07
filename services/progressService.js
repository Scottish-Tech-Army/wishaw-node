/**
 * Progress Service
 * Real API endpoints (FRONTEND_INTEGRATION):
 *   GET    /api/v1/progress/:playerId              -> PlayerProgress DTO
 *   POST   /api/v1/progress/award                 -> AwardRecord[]
 *          body: { challengeId: number, playerIds: number[] }
 */
var apiConfig = require('../config/apiConfig');
var mockData = require('./mockData');
var apiClient = require('../utils/apiClient');
var playerMediaStore = require('../utils/playerMediaStore');

function normaliseProgressList(progressList) {
  var categories = (progressList || []).map(function (category) {
    return {
      id: category.badgeCategoryId,
      code: category.categoryCode,
      name: category.categoryName,
      legacyPoints: category.legacyPoints,
      earnedPoints: category.earnedPoints,
      points: category.totalPoints,
      currentLevel: category.currentLevel
    };
  });
  var byCategory = {};
  categories.forEach(function (category) {
    byCategory[category.code || String(category.id)] = {
      category: category,
      points: category.points,
      awards: [],
      currentLevel: category.currentLevel
    };
  });
  return {
    categories: categories,
    byCategory: byCategory,
    awards: [],
    totalXp: categories.reduce(function (sum, category) { return sum + category.points; }, 0)
  };
}

function mapProfile(profile) {
  return {
    id: profile.id,
    username: profile.username,
    email: profile.username,
    displayName: profile.displayName,
    centreName: profile.centreName,
    groupName: profile.groupName,
    active: true,
    avatarUrl: profile.avatarUrl || null,
    imageUrl: profile.imageUrl || null
  };
}

async function getPlayerProgress(playerId, session) {
  if (!apiConfig.USE_MOCK) return normaliseProgressList(await apiClient.get('/players/' + playerId + '/progress', session));
  var awards = mockData.awardProgress.filter(function (a) { return a.playerId === parseInt(playerId); });
  var byCategory = {};
  mockData.badgeCategories.forEach(function (cat) { byCategory[cat.id] = { category: cat, points: 0, awards: [] }; });
  awards.forEach(function (a) {
    if (byCategory[a.badgeCategory]) {
      byCategory[a.badgeCategory].points += a.pointsAwarded;
      byCategory[a.badgeCategory].awards.push(a);
    }
  });
  return { playerId: parseInt(playerId), awards: awards, byCategory: byCategory, totalXp: awards.reduce(function (sum, a) { return sum + a.pointsAwarded; }, 0) };
}

async function getMyProfile(session) {
  if (!apiConfig.USE_MOCK) return playerMediaStore.applyToPlayer(mapProfile(await apiClient.get('/me/profile', session)));
  if (session && session.user && session.user.playerId) {
    var mockPlayer = mockData.players.find(function (player) { return player.id === parseInt(session.user.playerId); });
    return playerMediaStore.applyToPlayer(mockPlayer || null);
  }
  return null;
}

async function getMyProgress(session) {
  if (!apiConfig.USE_MOCK) return normaliseProgressList(await apiClient.get('/me/progress', session));
  return session && session.user && session.user.playerId ? getPlayerProgress(session.user.playerId, session) : null;
}

async function getPlayerProfile(playerId, session) {
  if (!apiConfig.USE_MOCK) return playerMediaStore.applyToPlayer(mapProfile(await apiClient.get('/players/' + playerId + '/profile', session)));
  return playerMediaStore.applyToPlayer(mockData.players.find(function (player) { return player.id === parseInt(playerId); }) || null);
}

async function awardChallenge(playerIds, challengeId, session) {
  if (!apiConfig.USE_MOCK) {
    return Promise.all(playerIds.map(function (playerId) {
      return apiClient.post('/admin/progress/award-challenge', {
        playerId: parseInt(playerId),
        challengeId: parseInt(challengeId)
      }, session);
    }));
  }
  var challenge = mockData.challenges.find(function (c) { return c.id === parseInt(challengeId); });
  if (!challenge) return [];
  var mod = mockData.modules.find(function (m) { return m.id === challenge.moduleId; });
  var results = [];
  playerIds.forEach(function (pid) {
    var player = mockData.players.find(function (p) { return p.id === parseInt(pid); });
    if (player) {
      var award = {
        playerId: player.id, playerName: player.displayName, challengeId: challenge.id, challengeName: challenge.name,
        moduleId: challenge.moduleId, moduleName: mod ? mod.name : '', badgeCategory: challenge.badgeCategory,
        pointsAwarded: challenge.points, awardedAt: new Date().toISOString().split('T')[0]
      };
      mockData.awardProgress.push(award);
      player.xp += challenge.points;
      results.push(award);
    }
  });
  return results;
}

module.exports = {
  getMyProfile: getMyProfile,
  getMyProgress: getMyProgress,
  getPlayerProfile: getPlayerProfile,
  getPlayerProgress: getPlayerProgress,
  awardChallenge: awardChallenge,
  normaliseProgressList: normaliseProgressList
};
