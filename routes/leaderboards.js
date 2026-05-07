var express = require('express');
var router = express.Router();

const { users, submissions, badgeCategories } = require('./mockData');
const { requireAuth } = require('./authMiddleware');

const ALL_ROLES = ['PLAYER', 'PARENT', 'COACH', 'ADMIN'];

/**
 * Map a frontend category label to the badge-category displayName.
 * Frontend sends e.g. "GAME MASTERY"; backend stores "Game Mastery".
 */
const CATEGORY_MAP = {
  'GAME MASTERY':    'Game Mastery',
  'TEAM WORK':       'Team Work',
  'ESPORTS CITIZEN': 'Esports Citizen',
  'PERSONAL DEV':    'Personal Development',
  'DIGITAL SKILLS':  'Digital Skills',
};

function buildRows(playerList, categoryFilter) {
  const rows = playerList
    .filter((u) => u.role === 'PLAYER')
    .map((u) => {
      let approvedSubs = submissions.filter(
        (s) => s.submittedBy.id === u.id && s.status === 'APPROVED'
      );

      // If a category filter is active, only count XP from that badge category
      if (categoryFilter && CATEGORY_MAP[categoryFilter]) {
        const catName = CATEGORY_MAP[categoryFilter];
        approvedSubs = approvedSubs.filter(
          (s) => s.challenge.badgeCategory.displayName === catName
        );
      }

      const totalXp = approvedSubs.reduce((sum, s) => sum + s.challenge.xpValue, 0);

      // Find top badge category (category with most XP)
      const xpByCategory = {};
      approvedSubs.forEach((s) => {
        const cat = s.challenge.badgeCategory.displayName;
        xpByCategory[cat] = (xpByCategory[cat] || 0) + s.challenge.xpValue;
      });
      const topBadge = Object.entries(xpByCategory).sort((a, b) => b[1] - a[1])[0];

      return {
        username: u.username,
        displayName: u.displayName || u.username,
        totalXp,
        centreName: u.centre ? u.centre.name : null,
        topBadge: topBadge ? topBadge[0].toUpperCase() : null,
      };
    })
    .filter((r) => r.totalXp > 0); // hide zero-XP players

  rows.sort((a, b) => b.totalXp - a.totalXp);

  return rows.map((r, i) => ({ rank: i + 1, ...r }));
}

// GET /leaderboards/centre?category=GAME+MASTERY
router.get('/centre', requireAuth(ALL_ROLES), (req, res) => {
  const currentUser = req.currentUser;
  const category = req.query.category || null;
  const centreUsers = users.filter((u) => u.centre.id === currentUser.centre.id);
  const rows = buildRows(centreUsers, category);
  return res.status(200).json({
    rows,
    currentUsername: currentUser.username,
    totalPlayers: centreUsers.filter((u) => u.role === 'PLAYER').length,
  });
});

// GET /leaderboards/global?category=TEAM+WORK&centre=Glasgow
router.get('/global', requireAuth(ALL_ROLES), (req, res) => {
  const currentUser = req.currentUser;
  const category = req.query.category || null;
  const centreFilter = req.query.centre || null;

  let playerPool = users;
  if (centreFilter) {
    playerPool = users.filter(
      (u) => u.centre && u.centre.name.toUpperCase() === centreFilter.toUpperCase()
    );
  }

  const rows = buildRows(playerPool, category);
  return res.status(200).json({
    rows,
    currentUsername: currentUser.username,
    totalPlayers: playerPool.filter((u) => u.role === 'PLAYER').length,
  });
});

module.exports = router;
