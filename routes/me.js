var express = require('express');
var router = express.Router();

const { modules, challenges, submissions, badgeCategories, levelDefinitions } = require('./mockData');
const { requireAuth } = require('./authMiddleware');

const ALL_ROLES = ['PLAYER', 'PARENT', 'COACH', 'ADMIN'];

// Helper: compute badge summary for a user based on their approved submissions
function computeBadges(userId, userSubmissions) {
  const approved = userSubmissions.filter((s) => s.status === 'APPROVED');

  // Group XP by badge category
  const xpByCategory = {};
  for (const sub of approved) {
    const cat = sub.challenge.badgeCategory.displayName;
    xpByCategory[cat] = (xpByCategory[cat] || 0) + sub.challenge.xpValue;
  }

  return badgeCategories.map((bc) => {
    const xp = xpByCategory[bc.displayName] || 0;
    const level = getLevelForXp(xp);
    const nextLevel = getNextLevel(xp);
    return {
      badgeCategory: bc.displayName,
      xp,
      level: level ? level.name : 'Bronze',
      nextLevelAtXp: nextLevel ? nextLevel.minXp : null,
    };
  });
}

function getLevelForXp(xp) {
  let current = null;
  for (const ld of levelDefinitions) {
    if (xp >= ld.minXp) current = ld;
  }
  return current;
}

function getNextLevel(xp) {
  for (const ld of [...levelDefinitions].sort((a, b) => a.minXp - b.minXp)) {
    if (ld.minXp > xp) return ld;
  }
  return null;
}

// GET /me/profile  → ProfileResponse: { userId, displayName, avatarUrl }
router.get('/profile', requireAuth(ALL_ROLES), (req, res) => {
  const user = req.currentUser;
  return res.status(200).json({
    userId: user.id,
    displayName: user.displayName || user.username,
    avatarUrl: user.avatarUrl || null,
  });
});

// GET /me/badges
router.get('/badges', requireAuth(ALL_ROLES), (req, res) => {
  const user = req.currentUser;
  const userSubmissions = submissions.filter((s) => s.submittedBy.id === user.id);
  const badges = computeBadges(user.id, userSubmissions);

  return res.status(200).json({ badges });
});

// GET /me/modules  → ModulesResponse: { modules: ModuleDto[] }
// ModuleDto: { moduleId, name, game, progress: { approved, total } }
router.get('/modules', requireAuth(ALL_ROLES), (req, res) => {
  const user = req.currentUser;
  const userSubmissions = submissions.filter((s) => s.submittedBy.id === user.id);

  const moduleDtos = modules.map((mod) => {
    const modChallenges = challenges.filter((c) => c.module.id === mod.id);
    const approved = modChallenges.filter((ch) =>
      userSubmissions.some((s) => s.challenge.id === ch.id && s.status === 'APPROVED')
    ).length;

    return {
      moduleId: mod.id,
      name: mod.displayName,
      game: mod.game ? mod.game.displayName : null,
      progress: {
        approved,
        total: modChallenges.length,
      },
    };
  });

  return res.status(200).json({ modules: moduleDtos });
});

// POST /me/challenges/:challengeId/submit
router.post('/challenges/:challengeId/submit', requireAuth(['PLAYER', 'PARENT', 'COACH', 'ADMIN']), (req, res) => {
  const { challengeId } = req.params;
  const { noteText } = req.body || {};

  if (!noteText || noteText.trim() === '') {
    return res.status(400).json({ error: 'noteText is required' });
  }

  const challenge = challenges.find((c) => c.id === challengeId);
  if (!challenge) {
    return res.status(400).json({ error: `Challenge ${challengeId} not found` });
  }

  const user = req.currentUser;
  const existing = submissions.find(
    (s) => s.challenge.id === challengeId && s.submittedBy.id === user.id && s.status === 'SUBMITTED'
  );
  if (existing) {
    return res.status(400).json({ error: 'You already have a pending submission for this challenge' });
  }

  const newSubmission = {
    id: `su-new-${Date.now()}`,
    challenge,
    noteText: noteText.trim(),
    status: 'SUBMITTED',
    submittedTs: new Date().toISOString(),
    submittedBy: user,
    reviewedTs: null,
    reviewedBy: null,
    reviewerComment: null,
  };

  submissions.push(newSubmission);

  return res.status(200).json({ submissionId: newSubmission.id, status: newSubmission.status });
});

module.exports = router;
