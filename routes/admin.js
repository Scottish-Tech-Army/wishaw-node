var express = require('express');
var router = express.Router();

const { submissions, users, badges } = require('./mockData');
const { requireAuth } = require('./authMiddleware');

const COACH_ADMIN = ['COACH', 'ADMIN'];

// ─── Helper: look up badge & sub-badge names for a challenge ─────────────────
function findBadgeContext(challengeId) {
  for (const badge of badges) {
    for (const sub of badge.subBadges || []) {
      for (const ch of sub.challenges || []) {
        if (ch.id === challengeId) {
          return { badgeName: badge.title, subBadgeName: sub.title, pts: sub.xp };
        }
      }
    }
  }
  return null;
}

// GET /admin/centre/submissions?status=SUBMITTED
router.get('/centre/submissions', requireAuth(COACH_ADMIN), (req, res) => {
  const { status = 'SUBMITTED' } = req.query;
  const coach = req.currentUser;

  const centreSubmissions = submissions.filter(
    (s) =>
      s.submittedBy.centre.id === coach.centre.id &&
      (status ? s.status === status : true)
  );

  const dtos = centreSubmissions.map((s) => ({
    submissionId: s.id,
    challengeId: s.challenge.id,
    challengeName: s.challenge.displayName,
    username: s.submittedBy.username,
    displayName: s.submittedBy.displayName || s.submittedBy.username,
    noteText: s.noteText,
    submittedAt: s.submittedTs,
  }));

  return res.status(200).json({ submissions: dtos });
});

// GET /admin/centre/pending-reviews
router.get('/centre/pending-reviews', requireAuth(COACH_ADMIN), (req, res) => {
  const coach = req.currentUser;

  const pending = submissions.filter(
    (s) =>
      s.submittedBy.centre.id === coach.centre.id &&
      s.status === 'SUBMITTED'
  );

  const dtos = pending.map((s) => {
    const ctx = findBadgeContext(s.challenge.id);
    return {
      submissionId: s.id,
      player: s.submittedBy.displayName || s.submittedBy.username,
      username: s.submittedBy.username,
      badge: ctx ? ctx.badgeName : s.challenge.badgeCategory?.displayName || 'Unknown',
      subBadge: ctx ? ctx.subBadgeName : s.challenge.displayName,
      pts: ctx ? ctx.pts : s.challenge.xpValue,
      noteText: s.noteText,
      submittedAt: s.submittedTs,
    };
  });

  return res.status(200).json({ reviews: dtos });
});

// GET /admin/centre/users
router.get('/centre/users', requireAuth(COACH_ADMIN), (req, res) => {
  const coach = req.currentUser;
  const centreUsers = users.filter(
    (u) => u.centre.id === coach.centre.id && u.role === 'PLAYER'
  );

  const dtos = centreUsers.map((u) => ({
    userId: u.id,
    centreId: u.centre ? u.centre.id : null,
    username: u.username,
    displayName: u.displayName || u.username,
    role: u.role,
    active: u.active,
  }));

  return res.status(200).json({ users: dtos });
});

// POST /admin/submissions/:submissionId/approve
router.post('/submissions/:submissionId/approve', requireAuth(COACH_ADMIN), (req, res) => {
  const { submissionId } = req.params;
  const { reviewerComment } = req.body || {};

  const sub = submissions.find((s) => s.id === submissionId);
  if (!sub) {
    return res.status(400).json({ error: `Submission ${submissionId} not found` });
  }
  if (sub.status !== 'SUBMITTED') {
    return res.status(400).json({ error: `Submission is already ${sub.status}` });
  }

  sub.status = 'APPROVED';
  sub.reviewedTs = new Date().toISOString();
  sub.reviewedBy = req.currentUser;
  sub.reviewerComment = reviewerComment || null;

  return res.status(200).json({ submissionId: sub.id, status: sub.status });
});

// POST /admin/submissions/:submissionId/reject
router.post('/submissions/:submissionId/reject', requireAuth(COACH_ADMIN), (req, res) => {
  const { submissionId } = req.params;
  const { reviewerComment } = req.body || {};

  const sub = submissions.find((s) => s.id === submissionId);
  if (!sub) {
    return res.status(400).json({ error: `Submission ${submissionId} not found` });
  }
  if (sub.status !== 'SUBMITTED') {
    return res.status(400).json({ error: `Submission is already ${sub.status}` });
  }

  sub.status = 'REJECTED';
  sub.reviewedTs = new Date().toISOString();
  sub.reviewedBy = req.currentUser;
  sub.reviewerComment = reviewerComment || null;

  return res.status(200).json({ submissionId: sub.id, status: sub.status });
});

module.exports = router;
