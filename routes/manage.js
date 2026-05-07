var express = require('express');
var router = express.Router();

const mockData = require('./mockData');
const { requireAuth } = require('./authMiddleware');

const ADMIN_ONLY = ['ADMIN'];

// ─── DTO mappers ──────────────────────────────────────────────────────────────

function toChallengeDto(ch) {
  return {
    challengeId: ch.id,
    moduleId: ch.module ? ch.module.id : null,
    badgeCategoryId: ch.badgeCategory ? ch.badgeCategory.id : null,
    displayName: ch.displayName,
    description: ch.description,
    xpValue: ch.xpValue,
  };
}

function toManageModuleDto(mod) {
  return {
    moduleId: mod.id,
    gameId: mod.game ? mod.game.id : null,
    displayName: mod.displayName,
    description: mod.description,
    active: mod.active !== undefined ? mod.active : true,
  };
}

function toUserDto(u) {
  return {
    userId: u.id,
    centreId: u.centre ? u.centre.id : null,
    username: u.username,
    displayName: u.displayName || u.username,
    role: u.role,
    active: u.active,
  };
}

function toSubmissionDto(s) {
  return {
    submissionId: s.id,
    challengeId: s.challenge ? s.challenge.id : null,
    challengeName: s.challenge ? s.challenge.displayName : null,
    username: s.submittedBy ? s.submittedBy.username : null,
    displayName: s.submittedBy ? (s.submittedBy.displayName || s.submittedBy.username) : null,
    noteText: s.noteText,
    submittedAt: s.submittedTs,
  };
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

// ─── Badge Categories /manage/badge-categories ────────────────────────────────

router.get('/badge-categories', requireAuth(ADMIN_ONLY), (req, res) => {
  res.status(200).json(mockData.badgeCategories);
});

router.post('/badge-categories', requireAuth(ADMIN_ONLY), (req, res) => {
  const body = req.body || {};
  const newItem = { id: newId(), displayName: body.displayName || '', description: body.description || '' };
  mockData.badgeCategories.push(newItem);
  return res.status(200).json(newItem);
});

router.get('/badge-categories/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const item = mockData.badgeCategories.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json(item);
});

router.put('/badge-categories/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const item = mockData.badgeCategories.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  const body = req.body || {};
  if (body.displayName !== undefined) item.displayName = body.displayName;
  if (body.description !== undefined) item.description = body.description;
  return res.status(200).json(item);
});

// ─── Centres /manage/centres ──────────────────────────────────────────────────

router.get('/centres', requireAuth(ADMIN_ONLY), (req, res) => {
  res.status(200).json(mockData.centres);
});

router.post('/centres', requireAuth(ADMIN_ONLY), (req, res) => {
  const body = req.body || {};
  const newItem = { id: newId(), name: body.name || '', active: true };
  mockData.centres.push(newItem);
  return res.status(200).json(newItem);
});

router.get('/centres/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const item = mockData.centres.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json(item);
});

router.put('/centres/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const item = mockData.centres.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  const body = req.body || {};
  if (body.name !== undefined) item.name = body.name;
  if (body.active !== undefined) item.active = body.active;
  return res.status(200).json(item);
});

// ─── Challenges /manage/challenges  →  ChallengeDto ──────────────────────────

router.get('/challenges', requireAuth(ADMIN_ONLY), (req, res) => {
  res.status(200).json(mockData.challenges.map(toChallengeDto));
});

router.post('/challenges', requireAuth(ADMIN_ONLY), (req, res) => {
  const body = req.body || {};
  const module = mockData.modules.find((m) => m.id === body.moduleId) || null;
  const meta = mockData.metadata.find((m) => m.id === body.metadataId) || null;
  const badgeCat = mockData.badgeCategories.find((b) => b.id === body.badgeCategoryId) || null;
  const newItem = {
    id: newId(),
    module,
    metadata: meta,
    displayName: body.displayName || '',
    description: body.description || '',
    badgeCategory: badgeCat,
    xpValue: body.xpValue || 0,
  };
  mockData.challenges.push(newItem);
  return res.status(200).json(toChallengeDto(newItem));
});

router.get('/challenges/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const item = mockData.challenges.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json(toChallengeDto(item));
});

router.put('/challenges/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const item = mockData.challenges.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  const body = req.body || {};
  if (body.displayName !== undefined) item.displayName = body.displayName;
  if (body.description !== undefined) item.description = body.description;
  if (body.xpValue !== undefined) item.xpValue = body.xpValue;
  if (body.metadataId !== undefined) {
    item.metadata = mockData.metadata.find((m) => m.id === body.metadataId) || item.metadata;
  }
  if (body.badgeCategoryId !== undefined) {
    item.badgeCategory = mockData.badgeCategories.find((b) => b.id === body.badgeCategoryId) || item.badgeCategory;
  }
  return res.status(200).json(toChallengeDto(item));
});

// ─── Games /manage/games ──────────────────────────────────────────────────────

router.get('/games', requireAuth(ADMIN_ONLY), (req, res) => {
  res.status(200).json(mockData.games);
});

router.post('/games', requireAuth(ADMIN_ONLY), (req, res) => {
  const body = req.body || {};
  const newItem = { id: newId(), displayName: body.displayName || '', active: true };
  mockData.games.push(newItem);
  return res.status(200).json(newItem);
});

router.get('/games/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const item = mockData.games.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json(item);
});

router.put('/games/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const item = mockData.games.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  const body = req.body || {};
  if (body.displayName !== undefined) item.displayName = body.displayName;
  if (body.active !== undefined) item.active = body.active;
  return res.status(200).json(item);
});

// ─── Level Definitions /manage/level-definitions ─────────────────────────────

router.get('/level-definitions', requireAuth(ADMIN_ONLY), (req, res) => {
  res.status(200).json(mockData.levelDefinitions);
});

router.post('/level-definitions', requireAuth(ADMIN_ONLY), (req, res) => {
  const body = req.body || {};
  const newItem = { id: newId(), name: body.name || '', minXp: body.minXp || 0, maxXp: body.maxXp || 0 };
  mockData.levelDefinitions.push(newItem);
  return res.status(200).json(newItem);
});

router.get('/level-definitions/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const item = mockData.levelDefinitions.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json(item);
});

router.put('/level-definitions/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const item = mockData.levelDefinitions.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  const body = req.body || {};
  if (body.name !== undefined) item.name = body.name;
  if (body.minXp !== undefined) item.minXp = body.minXp;
  if (body.maxXp !== undefined) item.maxXp = body.maxXp;
  return res.status(200).json(item);
});

// ─── Metadata /manage/metadata ────────────────────────────────────────────────

router.get('/metadata', requireAuth(ADMIN_ONLY), (req, res) => {
  res.status(200).json(mockData.metadata);
});

router.post('/metadata', requireAuth(ADMIN_ONLY), (req, res) => {
  const body = req.body || {};
  const newItem = { id: newId(), icon: body.icon || '', link: body.link || '' };
  mockData.metadata.push(newItem);
  return res.status(200).json(newItem);
});

router.get('/metadata/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const item = mockData.metadata.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json(item);
});

router.put('/metadata/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const item = mockData.metadata.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  const body = req.body || {};
  if (body.icon !== undefined) item.icon = body.icon;
  if (body.link !== undefined) item.link = body.link;
  return res.status(200).json(item);
});

// ─── Modules /manage/modules  →  ManageModuleDto ─────────────────────────────

router.get('/modules', requireAuth(ADMIN_ONLY), (req, res) => {
  res.status(200).json(mockData.modules.map(toManageModuleDto));
});

router.post('/modules', requireAuth(ADMIN_ONLY), (req, res) => {
  const body = req.body || {};
  const meta = mockData.metadata.find((m) => m.id === body.metadataId) || null;
  const game = mockData.games.find((g) => g.id === body.gameId) || null;
  const newItem = {
    id: newId(),
    metadata: meta,
    displayName: body.displayName || '',
    description: body.description || '',
    game,
    active: true,
  };
  mockData.modules.push(newItem);
  return res.status(200).json(toManageModuleDto(newItem));
});

router.get('/modules/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const item = mockData.modules.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json(toManageModuleDto(item));
});

router.put('/modules/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const item = mockData.modules.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  const body = req.body || {};
  if (body.displayName !== undefined) item.displayName = body.displayName;
  if (body.description !== undefined) item.description = body.description;
  if (body.active !== undefined) item.active = body.active;
  if (body.metadataId !== undefined) {
    item.metadata = mockData.metadata.find((m) => m.id === body.metadataId) || item.metadata;
  }
  if (body.gameId !== undefined) {
    item.game = mockData.games.find((g) => g.id === body.gameId) || item.game;
  }
  return res.status(200).json(toManageModuleDto(item));
});

// ─── Submissions /manage/submissions  →  SubmissionDto ───────────────────────

router.get('/submissions', requireAuth(ADMIN_ONLY), (req, res) => {
  const { status } = req.query;
  const filtered = status
    ? mockData.submissions.filter((s) => s.status === status)
    : mockData.submissions;
  return res.status(200).json(filtered.map(toSubmissionDto));
});

router.get('/submissions/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const sub = mockData.submissions.find((s) => s.id === req.params.id);
  if (!sub) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json(toSubmissionDto(sub));
});

router.put('/submissions/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const sub = mockData.submissions.find((s) => s.id === req.params.id);
  if (!sub) return res.status(404).json({ error: 'Not found' });
  const body = req.body || {};
  if (body.reviewerComment !== undefined) sub.reviewerComment = body.reviewerComment;
  if (body.status !== undefined) {
    sub.status = body.status;
    if (body.status !== 'SUBMITTED') sub.reviewedTs = new Date().toISOString();
  }
  return res.status(200).json(toSubmissionDto(sub));
});

// ─── Users /manage/users  →  UserDto ─────────────────────────────────────────

router.get('/users', requireAuth(ADMIN_ONLY), (req, res) => {
  return res.status(200).json(mockData.users.map(toUserDto));
});

router.post('/users', requireAuth(ADMIN_ONLY), (req, res) => {
  const body = req.body || {};
  if (!body.username || !body.password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
  const centre = mockData.centres.find((c) => c.id === body.centreId) || mockData.centres[0];
  const meta = mockData.metadata.find((m) => m.id === body.metadataId) || null;
  const parent = mockData.users.find((u) => u.id === body.parentId) || null;

  const newUser = {
    id: newId(),
    centre,
    metadata: meta,
    parent,
    username: body.username,
    displayName: body.username,
    avatarUrl: null,
    passwordHash: `hashed_${body.password}`,
    role: body.role || 'PLAYER',
    active: true,
  };

  mockData.users.push(newUser);
  mockData.credentials[newUser.username] = {
    password: body.password,
    userId: newUser.id,
    role: newUser.role,
  };

  return res.status(200).json(toUserDto(newUser));
});

router.get('/users/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const user = mockData.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json(toUserDto(user));
});

router.put('/users/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const user = mockData.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  const body = req.body || {};
  if (body.role !== undefined) user.role = body.role;
  if (body.active !== undefined) user.active = body.active;
  if (body.centreId !== undefined) {
    user.centre = mockData.centres.find((c) => c.id === body.centreId) || user.centre;
  }
  if (body.metadataId !== undefined) {
    user.metadata = mockData.metadata.find((m) => m.id === body.metadataId) || user.metadata;
  }
  if (body.parentId !== undefined) {
    user.parent = mockData.users.find((u) => u.id === body.parentId) || user.parent;
  }
  if (body.password !== undefined) {
    user.passwordHash = `hashed_${body.password}`;
    if (mockData.credentials[user.username]) {
      mockData.credentials[user.username].password = body.password;
    }
  }
  return res.status(200).json(toUserDto(user));
});

// ─── Groups /manage/groups ────────────────────────────────────────────────────

router.get('/groups', requireAuth(ADMIN_ONLY), (req, res) => {
  return res.status(200).json({
    groups: (mockData.groups || []).map((g) => ({
      id: g.id,
      name: g.name,
      label: g.label,
      labelVariant: g.labelVariant,
      members: g.members,
      maxMembers: g.maxMembers || null,
      schedule: g.schedule || null,
      description: g.description,
      icon: g.icon,
      featured: g.featured || false,
      live: g.live || false,
      game: g.game || '',
      ageRange: g.ageRange || '',
      category: g.category || '',
      playerCount: g.playerCount || g.members || 0,
      coach: g.coach || '',
    })),
    recentActivity: (mockData.groupRecentActivity || []).map((a) => ({
      type: a.type,
      text: a.text,
      time: a.time,
      variant: a.variant,
    })),
  });
});

router.post('/groups', requireAuth(ADMIN_ONLY), (req, res) => {
  const body = req.body || {};
  const newGroup = {
    id: newId(),
    name: body.name || '',
    label: body.label || '',
    labelVariant: body.labelVariant || 'academy',
    members: body.members || 0,
    maxMembers: body.maxMembers || null,
    schedule: body.schedule || null,
    description: body.description || '',
    icon: body.icon || 'sports_esports',
    featured: body.featured || false,
    live: body.live || false,
    game: body.game || '',
    ageRange: body.ageRange || '',
    category: body.category || '',
    playerCount: body.playerCount || body.members || 0,
    coach: body.coach || '',
  };
  mockData.groups.push(newGroup);
  return res.status(200).json(newGroup);
});

router.get('/groups/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const item = mockData.groups.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json(item);
});

router.put('/groups/:id', requireAuth(ADMIN_ONLY), (req, res) => {
  const item = mockData.groups.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  const body = req.body || {};
  if (body.name !== undefined) item.name = body.name;
  if (body.label !== undefined) item.label = body.label;
  if (body.labelVariant !== undefined) item.labelVariant = body.labelVariant;
  if (body.members !== undefined) item.members = body.members;
  if (body.maxMembers !== undefined) item.maxMembers = body.maxMembers;
  if (body.schedule !== undefined) item.schedule = body.schedule;
  if (body.description !== undefined) item.description = body.description;
  if (body.icon !== undefined) item.icon = body.icon;
  if (body.featured !== undefined) item.featured = body.featured;
  if (body.live !== undefined) item.live = body.live;
  if (body.game !== undefined) item.game = body.game;
  if (body.ageRange !== undefined) item.ageRange = body.ageRange;
  if (body.category !== undefined) item.category = body.category;
  if (body.playerCount !== undefined) item.playerCount = body.playerCount;
  if (body.coach !== undefined) item.coach = body.coach;
  return res.status(200).json(item);
});

module.exports = router;
