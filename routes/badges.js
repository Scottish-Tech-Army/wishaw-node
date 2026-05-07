var express = require('express');
var router = express.Router();

const mockData = require('./mockData');
const { requireAuth } = require('./authMiddleware');

const ADMIN_ONLY = ['ADMIN'];
const ADMIN_COACH = ['ADMIN', 'COACH'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function newId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

function toBadgeDto(badge) {
  return {
    badgeId: badge.id,
    title: badge.title,
    description: badge.description,
    image: badge.image || null,
    icon: badge.icon || 'military_tech',
    sequentialUnlock: badge.sequentialUnlock !== undefined ? badge.sequentialUnlock : true,
    subBadgeCount: (badge.subBadges || []).length,
  };
}

function toSubBadgeDto(sub) {
  return {
    subBadgeId: sub.id,
    badgeId: sub.badgeId,
    title: sub.title,
    info: sub.info || '',
    description: sub.description || '',
    category: sub.category || '',
    xp: sub.xp || 0,
    image: sub.image || null,
    sortOrder: sub.sortOrder || 0,
    challengeCount: (sub.challenges || []).length,
  };
}

function toChallengeDto(ch) {
  return {
    challengeId: ch.id,
    subBadgeId: ch.subBadgeId,
    title: ch.title,
    description: ch.description || '',
    pts: ch.pts || 0,
    sortOrder: ch.sortOrder || 0,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BADGES  /badges/manage
// ═══════════════════════════════════════════════════════════════════════════════

// GET /badges/manage  — List all badges (with sub-badge counts)
router.get('/manage', requireAuth(ADMIN_COACH), (req, res) => {
  return res.status(200).json(mockData.badges.map(toBadgeDto));
});

// POST /badges/manage  — Create a new badge category
router.post('/manage', requireAuth(ADMIN_ONLY), (req, res) => {
  const body = req.body || {};
  if (!body.title || !body.title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  const badge = {
    id: newId(),
    title: body.title.trim(),
    description: (body.description || '').trim(),
    image: body.image || null,
    icon: body.icon || 'military_tech',
    sequentialUnlock: body.sequentialUnlock !== undefined ? body.sequentialUnlock : true,
    subBadges: [],
  };
  mockData.badges.push(badge);
  return res.status(201).json(toBadgeDto(badge));
});

// GET /badges/manage/:badgeId  — Get single badge with full sub-badges
router.get('/manage/:badgeId', requireAuth(ADMIN_COACH), (req, res) => {
  const badge = mockData.badges.find((b) => b.id === req.params.badgeId);
  if (!badge) return res.status(404).json({ error: 'Badge not found' });
  return res.status(200).json({
    ...toBadgeDto(badge),
    subBadges: (badge.subBadges || []).map(toSubBadgeDto),
  });
});

// PUT /badges/manage/:badgeId  — Update badge
router.put('/manage/:badgeId', requireAuth(ADMIN_ONLY), (req, res) => {
  const badge = mockData.badges.find((b) => b.id === req.params.badgeId);
  if (!badge) return res.status(404).json({ error: 'Badge not found' });
  const body = req.body || {};
  if (body.title !== undefined) badge.title = body.title.trim();
  if (body.description !== undefined) badge.description = body.description.trim();
  if (body.image !== undefined) badge.image = body.image;
  if (body.icon !== undefined) badge.icon = body.icon;
  if (body.sequentialUnlock !== undefined) badge.sequentialUnlock = body.sequentialUnlock;
  return res.status(200).json(toBadgeDto(badge));
});

// DELETE /badges/manage/:badgeId  — Delete badge and all nested sub-badges/challenges
router.delete('/manage/:badgeId', requireAuth(ADMIN_ONLY), (req, res) => {
  const idx = mockData.badges.findIndex((b) => b.id === req.params.badgeId);
  if (idx === -1) return res.status(404).json({ error: 'Badge not found' });
  mockData.badges.splice(idx, 1);
  return res.status(200).json({ deleted: true });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-BADGES  /badges/manage/:badgeId/sub-badges
// ═══════════════════════════════════════════════════════════════════════════════

// GET  — list sub-badges for a badge
router.get('/manage/:badgeId/sub-badges', requireAuth(ADMIN_COACH), (req, res) => {
  const badge = mockData.badges.find((b) => b.id === req.params.badgeId);
  if (!badge) return res.status(404).json({ error: 'Badge not found' });
  const sorted = [...(badge.subBadges || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return res.status(200).json(sorted.map(toSubBadgeDto));
});

// POST  — create sub-badge
router.post('/manage/:badgeId/sub-badges', requireAuth(ADMIN_ONLY), (req, res) => {
  const badge = mockData.badges.find((b) => b.id === req.params.badgeId);
  if (!badge) return res.status(404).json({ error: 'Badge not found' });
  const body = req.body || {};
  if (!body.title || !body.title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (!badge.subBadges) badge.subBadges = [];
  const sub = {
    id: newId(),
    badgeId: badge.id,
    title: body.title.trim(),
    info: (body.info || '').trim(),
    description: (body.description || '').trim(),
    category: body.category || 'Activity',
    xp: body.xp || 0,
    image: body.image || null,
    sortOrder: body.sortOrder !== undefined ? body.sortOrder : badge.subBadges.length,
    challenges: [],
  };
  badge.subBadges.push(sub);
  return res.status(201).json(toSubBadgeDto(sub));
});

// GET  — single sub-badge with nested challenges
router.get('/manage/:badgeId/sub-badges/:subBadgeId', requireAuth(ADMIN_COACH), (req, res) => {
  const badge = mockData.badges.find((b) => b.id === req.params.badgeId);
  if (!badge) return res.status(404).json({ error: 'Badge not found' });
  const sub = (badge.subBadges || []).find((s) => s.id === req.params.subBadgeId);
  if (!sub) return res.status(404).json({ error: 'Sub-badge not found' });
  return res.status(200).json({
    ...toSubBadgeDto(sub),
    challenges: (sub.challenges || []).map(toChallengeDto),
  });
});

// PUT  — update sub-badge
router.put('/manage/:badgeId/sub-badges/:subBadgeId', requireAuth(ADMIN_ONLY), (req, res) => {
  const badge = mockData.badges.find((b) => b.id === req.params.badgeId);
  if (!badge) return res.status(404).json({ error: 'Badge not found' });
  const sub = (badge.subBadges || []).find((s) => s.id === req.params.subBadgeId);
  if (!sub) return res.status(404).json({ error: 'Sub-badge not found' });
  const body = req.body || {};
  if (body.title !== undefined) sub.title = body.title.trim();
  if (body.info !== undefined) sub.info = body.info.trim();
  if (body.description !== undefined) sub.description = body.description.trim();
  if (body.category !== undefined) sub.category = body.category;
  if (body.xp !== undefined) sub.xp = body.xp;
  if (body.image !== undefined) sub.image = body.image;
  if (body.sortOrder !== undefined) sub.sortOrder = body.sortOrder;
  return res.status(200).json(toSubBadgeDto(sub));
});

// DELETE  — delete sub-badge
router.delete('/manage/:badgeId/sub-badges/:subBadgeId', requireAuth(ADMIN_ONLY), (req, res) => {
  const badge = mockData.badges.find((b) => b.id === req.params.badgeId);
  if (!badge) return res.status(404).json({ error: 'Badge not found' });
  const idx = (badge.subBadges || []).findIndex((s) => s.id === req.params.subBadgeId);
  if (idx === -1) return res.status(404).json({ error: 'Sub-badge not found' });
  badge.subBadges.splice(idx, 1);
  return res.status(200).json({ deleted: true });
});

// PUT  — reorder sub-badges for a badge
router.put('/manage/:badgeId/sub-badges-order', requireAuth(ADMIN_ONLY), (req, res) => {
  const badge = mockData.badges.find((b) => b.id === req.params.badgeId);
  if (!badge) return res.status(404).json({ error: 'Badge not found' });
  const body = req.body || {};
  // body.order should be an array of sub-badge IDs in desired order
  if (!Array.isArray(body.order)) {
    return res.status(400).json({ error: 'order must be an array of sub-badge IDs' });
  }
  const subs = badge.subBadges || [];
  body.order.forEach((id, index) => {
    const sub = subs.find((s) => s.id === id);
    if (sub) sub.sortOrder = index;
  });
  subs.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return res.status(200).json(subs.map(toSubBadgeDto));
});

// ═══════════════════════════════════════════════════════════════════════════════
// CHALLENGES  /badges/manage/:badgeId/sub-badges/:subBadgeId/challenges
// ═══════════════════════════════════════════════════════════════════════════════

function findBadgeAndSub(req, res) {
  const badge = mockData.badges.find((b) => b.id === req.params.badgeId);
  if (!badge) { res.status(404).json({ error: 'Badge not found' }); return null; }
  const sub = (badge.subBadges || []).find((s) => s.id === req.params.subBadgeId);
  if (!sub) { res.status(404).json({ error: 'Sub-badge not found' }); return null; }
  return { badge, sub };
}

// GET  — list challenges for a sub-badge
router.get('/manage/:badgeId/sub-badges/:subBadgeId/challenges', requireAuth(ADMIN_COACH), (req, res) => {
  const ctx = findBadgeAndSub(req, res);
  if (!ctx) return;
  const sorted = [...(ctx.sub.challenges || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return res.status(200).json(sorted.map(toChallengeDto));
});

// POST  — create challenge
router.post('/manage/:badgeId/sub-badges/:subBadgeId/challenges', requireAuth(ADMIN_ONLY), (req, res) => {
  const ctx = findBadgeAndSub(req, res);
  if (!ctx) return;
  const body = req.body || {};
  if (!body.title || !body.title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (!ctx.sub.challenges) ctx.sub.challenges = [];
  const challenge = {
    id: newId(),
    subBadgeId: ctx.sub.id,
    title: body.title.trim(),
    description: (body.description || '').trim(),
    pts: body.pts || 0,
    sortOrder: body.sortOrder !== undefined ? body.sortOrder : ctx.sub.challenges.length,
  };
  ctx.sub.challenges.push(challenge);
  return res.status(201).json(toChallengeDto(challenge));
});

// GET  — single challenge
router.get('/manage/:badgeId/sub-badges/:subBadgeId/challenges/:challengeId', requireAuth(ADMIN_COACH), (req, res) => {
  const ctx = findBadgeAndSub(req, res);
  if (!ctx) return;
  const ch = (ctx.sub.challenges || []).find((c) => c.id === req.params.challengeId);
  if (!ch) return res.status(404).json({ error: 'Challenge not found' });
  return res.status(200).json(toChallengeDto(ch));
});

// PUT  — update challenge
router.put('/manage/:badgeId/sub-badges/:subBadgeId/challenges/:challengeId', requireAuth(ADMIN_ONLY), (req, res) => {
  const ctx = findBadgeAndSub(req, res);
  if (!ctx) return;
  const ch = (ctx.sub.challenges || []).find((c) => c.id === req.params.challengeId);
  if (!ch) return res.status(404).json({ error: 'Challenge not found' });
  const body = req.body || {};
  if (body.title !== undefined) ch.title = body.title.trim();
  if (body.description !== undefined) ch.description = body.description.trim();
  if (body.pts !== undefined) ch.pts = body.pts;
  if (body.sortOrder !== undefined) ch.sortOrder = body.sortOrder;
  return res.status(200).json(toChallengeDto(ch));
});

// DELETE  — delete challenge
router.delete('/manage/:badgeId/sub-badges/:subBadgeId/challenges/:challengeId', requireAuth(ADMIN_ONLY), (req, res) => {
  const ctx = findBadgeAndSub(req, res);
  if (!ctx) return;
  const idx = (ctx.sub.challenges || []).findIndex((c) => c.id === req.params.challengeId);
  if (idx === -1) return res.status(404).json({ error: 'Challenge not found' });
  ctx.sub.challenges.splice(idx, 1);
  return res.status(200).json({ deleted: true });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC  /badges  — read-only badge tree for players
// ═══════════════════════════════════════════════════════════════════════════════

router.get('/', requireAuth(), (req, res) => {
  return res.status(200).json(
    mockData.badges.map((badge) => ({
      ...toBadgeDto(badge),
      subBadges: (badge.subBadges || [])
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .map((sub) => ({
          ...toSubBadgeDto(sub),
          challenges: (sub.challenges || [])
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
            .map(toChallengeDto),
        })),
    })),
  );
});

module.exports = router;
