// Mock data shared across all route handlers

const centres = [
  { id: 'c1a2b3c4-0000-0000-0000-000000000001', name: 'Wishaw', active: true },
  { id: 'c1a2b3c4-0000-0000-0000-000000000002', name: 'Glasgow', active: true },
  { id: 'c1a2b3c4-0000-0000-0000-000000000003', name: 'Edinburgh', active: true },
  { id: 'c1a2b3c4-0000-0000-0000-000000000004', name: 'Belfast', active: true },
];

const metadata = [
  { id: 'm1000000-0000-0000-0000-000000000001', icon: 'game-mastery', link: 'https://wymcaesports.co.uk/game-mastery/' },
  { id: 'm1000000-0000-0000-0000-000000000002', icon: 'team-work', link: 'https://wymcaesports.co.uk/team-work/' },
  { id: 'm1000000-0000-0000-0000-000000000003', icon: 'personal-dev', link: 'https://wymcaesports.co.uk/personal-development/' },
  { id: 'm1000000-0000-0000-0000-000000000004', icon: 'esports-citizen', link: 'https://wymcaesports.co.uk/esports-citizen/' },
  { id: 'm1000000-0000-0000-0000-000000000005', icon: 'digital-skills', link: 'https://wymcaesports.co.uk/digital-skills/' },
];

const badgeCategories = [
  { id: 'bc000001-0000-0000-0000-000000000001', displayName: 'Game Mastery', description: 'Understanding your chosen game through mechanics, strategy and match play.' },
  { id: 'bc000001-0000-0000-0000-000000000002', displayName: 'Team Work', description: 'Working together through communication, collaboration and player roles.' },
  { id: 'bc000001-0000-0000-0000-000000000003', displayName: 'Personal Development', description: 'Understanding strengths, weaknesses and goals through practice and mindset.' },
  { id: 'bc000001-0000-0000-0000-000000000004', displayName: 'Esports Citizen', description: 'Sportsmanship, community and academy rules.' },
  { id: 'bc000001-0000-0000-0000-000000000005', displayName: 'Digital Skills', description: 'Content creation, digital safety and online presence.' },
];

const games = [
  { id: 'ga000001-0000-0000-0000-000000000001', displayName: 'Fortnite', active: true },
  { id: 'ga000001-0000-0000-0000-000000000002', displayName: 'Rocket League', active: true },
  { id: 'ga000001-0000-0000-0000-000000000003', displayName: 'FIFA', active: true },
];

const levelDefinitions = [
  { id: 'ld000001-0000-0000-0000-000000000001', name: 'Bronze', minXp: 0, maxXp: 49 },
  { id: 'ld000001-0000-0000-0000-000000000002', name: 'Silver', minXp: 50, maxXp: 149 },
  { id: 'ld000001-0000-0000-0000-000000000003', name: 'Gold', minXp: 150, maxXp: 299 },
  { id: 'ld000001-0000-0000-0000-000000000004', name: 'Platinum', minXp: 300, maxXp: 499 },
  { id: 'ld000001-0000-0000-0000-000000000005', name: 'Diamond', minXp: 500, maxXp: 999 },
];

const modules = [
  {
    id: 'mo000001-0000-0000-0000-000000000001',
    metadata: metadata[0],
    displayName: 'Game Mastery Module',
    description: 'Core game skills and mechanics challenges.',
    game: games[0],
    active: true,
  },
  {
    id: 'mo000001-0000-0000-0000-000000000002',
    metadata: metadata[1],
    displayName: 'Team Work Module',
    description: 'Communication and collaboration challenges.',
    game: games[0],
    active: true,
  },
  {
    id: 'mo000001-0000-0000-0000-000000000003',
    metadata: metadata[2],
    displayName: 'Personal Development Module',
    description: 'Mindset, habits and personal growth challenges.',
    game: games[0],
    active: true,
  },
];

const challenges = [
  {
    id: 'ch000001-0000-0000-0000-000000000001',
    module: modules[0],
    metadata: metadata[0],
    displayName: 'Advanced Mechanics',
    description: 'Demonstrate 3 advanced mechanics under a coach\'s supervision.',
    badgeCategory: badgeCategories[0],
    xpValue: 4,
  },
  {
    id: 'ch000001-0000-0000-0000-000000000002',
    module: modules[0],
    metadata: metadata[0],
    displayName: 'High Scorer',
    description: 'Achieve an above average score in 3 matches.',
    badgeCategory: badgeCategories[0],
    xpValue: 6,
  },
  {
    id: 'ch000001-0000-0000-0000-000000000003',
    module: modules[1],
    metadata: metadata[1],
    displayName: 'Effective Comms',
    description: 'Demonstrate good communication with teammates.',
    badgeCategory: badgeCategories[1],
    xpValue: 3,
  },
  {
    id: 'ch000001-0000-0000-0000-000000000004',
    module: modules[1],
    metadata: metadata[1],
    displayName: 'Team Player',
    description: 'Play 5 matches as part of a team.',
    badgeCategory: badgeCategories[1],
    xpValue: 4,
  },
  {
    id: 'ch000001-0000-0000-0000-000000000005',
    module: modules[2],
    metadata: metadata[2],
    displayName: 'Positivity Pioneer',
    description: 'Demonstrate positive thinking before a match.',
    badgeCategory: badgeCategories[2],
    xpValue: 3,
  },
];

const users = [
  // ─── Wishaw players ───
  { id: 'us000001-0000-0000-0000-000000000001', centre: centres[0], metadata: metadata[0], parent: null, username: 'PHOENIX_REIGN', displayName: 'PHOENIX_REIGN', avatarUrl: null, passwordHash: 'hashed_password', role: 'PLAYER', active: true },
  { id: 'us000001-0000-0000-0000-000000000002', centre: centres[0], metadata: metadata[0], parent: null, username: 'CYBER_PHX',     displayName: 'CYBER_PHX',     avatarUrl: null, passwordHash: 'hashed_password', role: 'PLAYER', active: true },
  { id: 'us000001-0000-0000-0000-000000000003', centre: centres[0], metadata: metadata[0], parent: null, username: 'Z-STORM_99',    displayName: 'Z-STORM_99',    avatarUrl: null, passwordHash: 'hashed_password', role: 'PLAYER', active: true },
  { id: 'us000001-0000-0000-0000-000000000004', centre: centres[0], metadata: metadata[0], parent: null, username: 'NEON_DRIFT',    displayName: 'NEON_DRIFT',    avatarUrl: null, passwordHash: 'hashed_password', role: 'PLAYER', active: true },
  { id: 'us000001-0000-0000-0000-000000000005', centre: centres[0], metadata: metadata[0], parent: null, username: 'BLAZE_ULTRA',   displayName: 'BLAZE_ULTRA',   avatarUrl: null, passwordHash: 'hashed_password', role: 'PLAYER', active: true },
  { id: 'us000001-0000-0000-0000-000000000006', centre: centres[0], metadata: metadata[0], parent: null, username: 'DELTA_SURGE',   displayName: 'DELTA_SURGE',   avatarUrl: null, passwordHash: 'hashed_password', role: 'PLAYER', active: true },
  { id: 'us000001-0000-0000-0000-000000000007', centre: centres[0], metadata: metadata[0], parent: null, username: 'HUB_MSTR',      displayName: 'HUB_MSTR',      avatarUrl: null, passwordHash: 'hashed_password', role: 'PLAYER', active: true },
  // ─── Glasgow players ───
  { id: 'us000001-0000-0000-0000-000000000008', centre: centres[1], metadata: metadata[0], parent: null, username: 'GLITCH_STR',    displayName: 'GLITCH_STR',    avatarUrl: null, passwordHash: 'hashed_password', role: 'PLAYER', active: true },
  { id: 'us000001-0000-0000-0000-000000000009', centre: centres[1], metadata: metadata[0], parent: null, username: 'APEX_SHADOW',   displayName: 'APEX_SHADOW',   avatarUrl: null, passwordHash: 'hashed_password', role: 'PLAYER', active: true },
  { id: 'us000001-0000-0000-0000-000000000010', centre: centres[1], metadata: metadata[0], parent: null, username: 'HYPER_CLASH',   displayName: 'HYPER_CLASH',   avatarUrl: null, passwordHash: 'hashed_password', role: 'PLAYER', active: true },
  // ─── Edinburgh players ───
  { id: 'us000001-0000-0000-0000-000000000011', centre: centres[2], metadata: metadata[0], parent: null, username: 'VOID_PULSE',    displayName: 'VOID_PULSE',    avatarUrl: null, passwordHash: 'hashed_password', role: 'PLAYER', active: true },
  { id: 'us000001-0000-0000-0000-000000000012', centre: centres[2], metadata: metadata[0], parent: null, username: 'STORM_RIDER',   displayName: 'STORM_RIDER',   avatarUrl: null, passwordHash: 'hashed_password', role: 'PLAYER', active: true },
  // ─── Belfast players ───
  { id: 'us000001-0000-0000-0000-000000000013', centre: centres[3], metadata: metadata[0], parent: null, username: 'FROST_BYTE',    displayName: 'FROST_BYTE',    avatarUrl: null, passwordHash: 'hashed_password', role: 'PLAYER', active: true },
  { id: 'us000001-0000-0000-0000-000000000014', centre: centres[3], metadata: metadata[0], parent: null, username: 'KINETIC_X',     displayName: 'KINETIC_X',     avatarUrl: null, passwordHash: 'hashed_password', role: 'PLAYER', active: true },
  // ─── Staff ───
  { id: 'us000001-0000-0000-0000-000000000020', centre: centres[0], metadata: metadata[0], parent: null, username: 'coach1',  displayName: 'Coach One',  avatarUrl: null, passwordHash: 'hashed_password', role: 'COACH', active: true },
  { id: 'us000001-0000-0000-0000-000000000021', centre: centres[0], metadata: metadata[0], parent: null, username: 'admin',   displayName: 'Admin User', avatarUrl: null, passwordHash: 'hashed_password', role: 'ADMIN', active: true },
];

// Credentials map for mock login (username -> { password, userId })
const credentials = {
  PHOENIX_REIGN: { password: 'password', userId: users[0].id,  role: 'PLAYER' },
  CYBER_PHX:     { password: 'password', userId: users[1].id,  role: 'PLAYER' },
  'Z-STORM_99':  { password: 'password', userId: users[2].id,  role: 'PLAYER' },
  NEON_DRIFT:    { password: 'password', userId: users[3].id,  role: 'PLAYER' },
  BLAZE_ULTRA:   { password: 'password', userId: users[4].id,  role: 'PLAYER' },
  DELTA_SURGE:   { password: 'password', userId: users[5].id,  role: 'PLAYER' },
  HUB_MSTR:      { password: 'password', userId: users[6].id,  role: 'PLAYER' },
  GLITCH_STR:    { password: 'password', userId: users[7].id,  role: 'PLAYER' },
  APEX_SHADOW:   { password: 'password', userId: users[8].id,  role: 'PLAYER' },
  HYPER_CLASH:   { password: 'password', userId: users[9].id,  role: 'PLAYER' },
  VOID_PULSE:    { password: 'password', userId: users[10].id, role: 'PLAYER' },
  STORM_RIDER:   { password: 'password', userId: users[11].id, role: 'PLAYER' },
  FROST_BYTE:    { password: 'password', userId: users[12].id, role: 'PLAYER' },
  KINETIC_X:     { password: 'password', userId: users[13].id, role: 'PLAYER' },
  coach1:        { password: 'password', userId: users[14].id, role: 'COACH' },
  admin:         { password: 'password', userId: users[15].id, role: 'ADMIN' },
};

// ─── Helper to create many approved submissions for realistic leaderboard data ───
const coach = users[14]; // coach1
let subIdx = 1;
function approved(user, challenge, note) {
  return {
    id: `su-auto-${String(subIdx++).padStart(4, '0')}`,
    challenge,
    noteText: note || 'Completed during session.',
    status: 'APPROVED',
    submittedTs: '2026-03-20T10:00:00Z',
    submittedBy: user,
    reviewedTs: '2026-03-21T09:00:00Z',
    reviewedBy: coach,
    reviewerComment: 'Great work!',
  };
}

// Generate bulk approved submissions so every player has distinct XP totals.
// challenges[0] = Game Mastery 4xp, [1] = Game Mastery 6xp,
// challenges[2] = Team Work 3xp,    [3] = Team Work 4xp,
// challenges[4] = Personal Dev 3xp
const submissions = [
  // ─── PHOENIX_REIGN (Wishaw) – target ~236 XP ───
  ...Array(20).fill(null).map(() => approved(users[0], challenges[1])),  // 20×6 = 120
  ...Array(15).fill(null).map(() => approved(users[0], challenges[0])),  // 15×4 = 60
  ...Array(10).fill(null).map(() => approved(users[0], challenges[3])),  // 10×4 = 40
  ...Array(4).fill(null).map(() => approved(users[0], challenges[2])),   //  4×3 = 12
  ...Array(1).fill(null).map(() => approved(users[0], challenges[4])),   //  1×3 = 3  → 235

  // ─── CYBER_PHX (Wishaw) – target ~198 XP ───
  ...Array(15).fill(null).map(() => approved(users[1], challenges[1])),  // 15×6 = 90
  ...Array(12).fill(null).map(() => approved(users[1], challenges[0])),  // 12×4 = 48
  ...Array(8).fill(null).map(() => approved(users[1], challenges[3])),   //  8×4 = 32
  ...Array(6).fill(null).map(() => approved(users[1], challenges[2])),   //  6×3 = 18
  ...Array(3).fill(null).map(() => approved(users[1], challenges[4])),   //  3×3 = 9  → 197

  // ─── GLITCH_STR (Glasgow) – target ~145 XP ───
  ...Array(10).fill(null).map(() => approved(users[7], challenges[1])),  // 10×6 = 60
  ...Array(10).fill(null).map(() => approved(users[7], challenges[0])),  // 10×4 = 40
  ...Array(5).fill(null).map(() => approved(users[7], challenges[3])),   //  5×4 = 20
  ...Array(5).fill(null).map(() => approved(users[7], challenges[2])),   //  5×3 = 15
  ...Array(3).fill(null).map(() => approved(users[7], challenges[4])),   //  3×3 = 9  → 144

  // ─── Z-STORM_99 (Wishaw) – target ~132 XP ───
  ...Array(10).fill(null).map(() => approved(users[2], challenges[1])),  // 10×6 = 60
  ...Array(8).fill(null).map(() => approved(users[2], challenges[0])),   //  8×4 = 32
  ...Array(5).fill(null).map(() => approved(users[2], challenges[3])),   //  5×4 = 20
  ...Array(4).fill(null).map(() => approved(users[2], challenges[2])),   //  4×3 = 12
  ...Array(3).fill(null).map(() => approved(users[2], challenges[4])),   //  3×3 = 9  → 133

  // ─── NEON_DRIFT (Wishaw) – target ~118 XP ───
  ...Array(8).fill(null).map(() => approved(users[3], challenges[1])),   //  8×6 = 48
  ...Array(7).fill(null).map(() => approved(users[3], challenges[0])),   //  7×4 = 28
  ...Array(5).fill(null).map(() => approved(users[3], challenges[3])),   //  5×4 = 20
  ...Array(4).fill(null).map(() => approved(users[3], challenges[2])),   //  4×3 = 12
  ...Array(3).fill(null).map(() => approved(users[3], challenges[4])),   //  3×3 = 9  → 117

  // ─── APEX_SHADOW (Glasgow) – target ~105 XP ───
  ...Array(7).fill(null).map(() => approved(users[8], challenges[1])),   //  7×6 = 42
  ...Array(6).fill(null).map(() => approved(users[8], challenges[0])),   //  6×4 = 24
  ...Array(5).fill(null).map(() => approved(users[8], challenges[3])),   //  5×4 = 20
  ...Array(4).fill(null).map(() => approved(users[8], challenges[2])),   //  4×3 = 12
  ...Array(2).fill(null).map(() => approved(users[8], challenges[4])),   //  2×3 = 6  → 104

  // ─── FROST_BYTE (Belfast) – target ~94 XP ───
  ...Array(6).fill(null).map(() => approved(users[12], challenges[1])),  //  6×6 = 36
  ...Array(5).fill(null).map(() => approved(users[12], challenges[0])),  //  5×4 = 20
  ...Array(4).fill(null).map(() => approved(users[12], challenges[3])),  //  4×4 = 16
  ...Array(4).fill(null).map(() => approved(users[12], challenges[2])),  //  4×3 = 12
  ...Array(3).fill(null).map(() => approved(users[12], challenges[4])),  //  3×3 = 9  → 93

  // ─── BLAZE_ULTRA (Wishaw) – target ~87 XP ───
  ...Array(5).fill(null).map(() => approved(users[4], challenges[1])),   //  5×6 = 30
  ...Array(5).fill(null).map(() => approved(users[4], challenges[0])),   //  5×4 = 20
  ...Array(4).fill(null).map(() => approved(users[4], challenges[3])),   //  4×4 = 16
  ...Array(4).fill(null).map(() => approved(users[4], challenges[2])),   //  4×3 = 12
  ...Array(3).fill(null).map(() => approved(users[4], challenges[4])),   //  3×3 = 9  → 87

  // ─── VOID_PULSE (Edinburgh) – target ~76 XP ───
  ...Array(5).fill(null).map(() => approved(users[10], challenges[1])),  //  5×6 = 30
  ...Array(4).fill(null).map(() => approved(users[10], challenges[0])),  //  4×4 = 16
  ...Array(3).fill(null).map(() => approved(users[10], challenges[3])),  //  3×4 = 12
  ...Array(3).fill(null).map(() => approved(users[10], challenges[2])),  //  3×3 = 9
  ...Array(3).fill(null).map(() => approved(users[10], challenges[4])),  //  3×3 = 9  → 76

  // ─── HYPER_CLASH (Glasgow) – target ~68 XP ───
  ...Array(4).fill(null).map(() => approved(users[9], challenges[1])),   //  4×6 = 24
  ...Array(4).fill(null).map(() => approved(users[9], challenges[0])),   //  4×4 = 16
  ...Array(3).fill(null).map(() => approved(users[9], challenges[3])),   //  3×4 = 12
  ...Array(3).fill(null).map(() => approved(users[9], challenges[2])),   //  3×3 = 9
  ...Array(2).fill(null).map(() => approved(users[9], challenges[4])),   //  2×3 = 6  → 67

  // ─── DELTA_SURGE (Wishaw) – target ~55 XP ───
  ...Array(3).fill(null).map(() => approved(users[5], challenges[1])),   //  3×6 = 18
  ...Array(3).fill(null).map(() => approved(users[5], challenges[0])),   //  3×4 = 12
  ...Array(2).fill(null).map(() => approved(users[5], challenges[3])),   //  2×4 = 8
  ...Array(3).fill(null).map(() => approved(users[5], challenges[2])),   //  3×3 = 9
  ...Array(2).fill(null).map(() => approved(users[5], challenges[4])),   //  2×3 = 6  → 53

  // ─── HUB_MSTR (Wishaw) – target ~42 XP ───
  ...Array(2).fill(null).map(() => approved(users[6], challenges[1])),   //  2×6 = 12
  ...Array(2).fill(null).map(() => approved(users[6], challenges[0])),   //  2×4 = 8
  ...Array(2).fill(null).map(() => approved(users[6], challenges[3])),   //  2×4 = 8
  ...Array(2).fill(null).map(() => approved(users[6], challenges[2])),   //  2×3 = 6
  ...Array(3).fill(null).map(() => approved(users[6], challenges[4])),   //  3×3 = 9  → 43

  // ─── KINETIC_X (Belfast) – target ~38 XP ───
  ...Array(2).fill(null).map(() => approved(users[13], challenges[1])),  //  2×6 = 12
  ...Array(2).fill(null).map(() => approved(users[13], challenges[0])),  //  2×4 = 8
  ...Array(2).fill(null).map(() => approved(users[13], challenges[3])),  //  2×4 = 8
  ...Array(2).fill(null).map(() => approved(users[13], challenges[2])),  //  2×3 = 6
  ...Array(1).fill(null).map(() => approved(users[13], challenges[4])),  //  1×3 = 3  → 37

  // ─── STORM_RIDER (Edinburgh) – target ~25 XP ───
  ...Array(1).fill(null).map(() => approved(users[11], challenges[1])),  //  1×6 = 6
  ...Array(1).fill(null).map(() => approved(users[11], challenges[0])),  //  1×4 = 4
  ...Array(1).fill(null).map(() => approved(users[11], challenges[3])),  //  1×4 = 4
  ...Array(2).fill(null).map(() => approved(users[11], challenges[2])),  //  2×3 = 6
  ...Array(2).fill(null).map(() => approved(users[11], challenges[4])),  //  2×3 = 6  → 26

  // ─── Pending (SUBMITTED) reviews ───
  {
    id: 'su-pending-0001',
    challenge: challenges[0],                          // Advanced Mechanics (Game Mastery, 4 xp)
    noteText: 'Performed 3 advanced mechanics in today\'s session.',
    status: 'SUBMITTED',
    submittedTs: '2026-03-30T14:00:00Z',
    submittedBy: users[3],                             // NEON_DRIFT (Wishaw)
    reviewedTs: null,
    reviewedBy: null,
    reviewerComment: null,
  },
  {
    id: 'su-pending-0002',
    challenge: challenges[2],                          // Effective Comms (Team Work, 3 xp)
    noteText: 'Demonstrated clear callouts during team match.',
    status: 'SUBMITTED',
    submittedTs: '2026-03-30T14:30:00Z',
    submittedBy: users[4],                             // BLAZE_ULTRA (Wishaw)
    reviewedTs: null,
    reviewedBy: null,
    reviewerComment: null,
  },
  {
    id: 'su-pending-0003',
    challenge: challenges[1],                          // High Scorer (Game Mastery, 6 xp)
    noteText: 'Created and shared a highlight reel with the group.',
    status: 'SUBMITTED',
    submittedTs: '2026-03-30T15:00:00Z',
    submittedBy: users[1],                             // CYBER_PHX (Wishaw)
    reviewedTs: null,
    reviewedBy: null,
    reviewerComment: null,
  },
];

// ─── Badge hierarchy (used by /badges routes) ────────────────────────────────
let badgeSeedIdx = 1;
function seedId(prefix) {
  return `${prefix}-seed-${String(badgeSeedIdx++).padStart(4, '0')}`;
}

const badges = [
  {
    id: seedId('badge'),
    title: 'Game Mastery',
    description: 'Game Mastery is about understanding your chosen game. Level up this badge by completing challenges around building game sense, developing game mechanics and securing victories.',
    image: null,
    icon: 'sports_esports',
    sequentialUnlock: true,
    subBadges: [
      {
        id: seedId('sub'), badgeId: 'badge-seed-0001', title: 'Advanced Mechanics', info: 'Demonstrate 3 advanced mechanics',
        description: 'This sub-badge can be earned by successfully performing 3 advanced game mechanics under a coaches supervision.',
        category: 'Activity', xp: 4, image: null, sortOrder: 0,
        challenges: [
          { id: seedId('ch'), subBadgeId: 'sub-seed-0002', title: 'Perfect Timing Challenge', description: 'Hit 5 consecutive perfect ability procs in a practice session.', pts: 2, sortOrder: 0 },
          { id: seedId('ch'), subBadgeId: 'sub-seed-0002', title: 'Movement Optimization', description: 'Complete the obstacle course under 45 seconds.', pts: 2, sortOrder: 1 },
        ],
      },
      {
        id: seedId('sub'), badgeId: 'badge-seed-0001', title: 'Analyst', info: 'Break down a recorded match and identify key moments',
        description: 'You can achieve this badge by attending lesson and analysing your match.',
        category: 'Lesson', xp: 10, image: null, sortOrder: 1,
        challenges: [
          { id: seedId('ch'), subBadgeId: 'sub-seed-0005', title: 'VOD Breakdown: Positioning', description: "Complete the 'Loss Analysis' lesson and identify 3 positioning errors.", pts: 5, sortOrder: 0 },
          { id: seedId('ch'), subBadgeId: 'sub-seed-0005', title: 'Match Review Presentation', description: 'Present your VOD review findings to the group.', pts: 5, sortOrder: 1 },
        ],
      },
      {
        id: seedId('sub'), badgeId: 'badge-seed-0001', title: 'Average Scorer', info: 'Achieve an average score in 3 matches',
        description: 'To earn this badge you must achieve an average score in 3 matches.',
        category: 'Activity', xp: 4, image: null, sortOrder: 2,
        challenges: [
          { id: seedId('ch'), subBadgeId: 'sub-seed-0008', title: 'Average Score Match 1', description: 'Achieve an average score in a competitive match.', pts: 1, sortOrder: 0 },
          { id: seedId('ch'), subBadgeId: 'sub-seed-0008', title: 'Average Score Match 2', description: 'Achieve an average score in a 2nd match. Show evidence.', pts: 1, sortOrder: 1 },
          { id: seedId('ch'), subBadgeId: 'sub-seed-0008', title: 'Average Score Match 3', description: 'Achieve an average score in a 3rd match. Show evidence.', pts: 2, sortOrder: 2 },
        ],
      },
      {
        id: seedId('sub'), badgeId: 'badge-seed-0001', title: 'High Scorer', info: 'Achieve an above average score in 3 matches',
        description: 'To achieve this badge you must achieve an above average score in 3 matches.',
        category: 'Activity', xp: 6, image: null, sortOrder: 3,
        challenges: [
          { id: seedId('ch'), subBadgeId: 'sub-seed-0012', title: 'High Score Match 1', description: 'Achieve an above-average score in a competitive match.', pts: 2, sortOrder: 0 },
          { id: seedId('ch'), subBadgeId: 'sub-seed-0012', title: 'High Score Match 2', description: 'Achieve an above-average score in a 2nd match.', pts: 2, sortOrder: 1 },
          { id: seedId('ch'), subBadgeId: 'sub-seed-0012', title: 'High Score Match 3', description: 'Achieve an above-average score in a 3rd match.', pts: 2, sortOrder: 2 },
        ],
      },
      {
        id: seedId('sub'), badgeId: 'badge-seed-0001', title: 'Endgame Expert', info: 'Understand Endgames',
        description: 'To earn this badge you must participate fully in a group lesson about end games.',
        category: 'Lesson', xp: 10, image: null, sortOrder: 4,
        challenges: [
          { id: seedId('ch'), subBadgeId: 'sub-seed-0016', title: 'Endgame Lesson', description: 'Attend the endgame strategy lesson and complete the worksheet.', pts: 5, sortOrder: 0 },
          { id: seedId('ch'), subBadgeId: 'sub-seed-0016', title: 'Endgame Application', description: 'Demonstrate endgame strategy in a live match.', pts: 5, sortOrder: 1 },
        ],
      },
    ],
  },
  {
    id: seedId('badge'),
    title: 'Team Work',
    description: 'Working together through communication, collaboration and player roles.',
    image: null,
    icon: 'groups',
    sequentialUnlock: true,
    subBadges: [
      {
        id: seedId('sub'), badgeId: 'badge-seed-0019', title: 'Cheerleader', info: 'Encourage and support teammates',
        description: 'Keep morale high and encourage teammates during matches.',
        category: 'Activity', xp: 6, image: null, sortOrder: 0,
        challenges: [
          { id: seedId('ch'), subBadgeId: 'sub-seed-0020', title: 'Positive Encouragement', description: 'Keep morale high and encourage teammates during a full match.', pts: 3, sortOrder: 0 },
          { id: seedId('ch'), subBadgeId: 'sub-seed-0020', title: 'Team Motivator', description: 'Lead a pre-match team huddle with positive callouts.', pts: 3, sortOrder: 1 },
        ],
      },
      {
        id: seedId('sub'), badgeId: 'badge-seed-0019', title: 'Communicator', info: 'Demonstrate effective communication',
        description: 'Show clear and effective communication with your team.',
        category: 'Lesson', xp: 10, image: null, sortOrder: 1,
        challenges: [
          { id: seedId('ch'), subBadgeId: 'sub-seed-0023', title: 'Comms Lesson', description: 'Attend the effective communications lesson.', pts: 5, sortOrder: 0 },
          { id: seedId('ch'), subBadgeId: 'sub-seed-0023', title: 'Comms in Action', description: 'Demonstrate clear callouts and communication during a match.', pts: 5, sortOrder: 1 },
        ],
      },
      {
        id: seedId('sub'), badgeId: 'badge-seed-0019', title: 'Activity Planner', info: 'Plan and lead a team activity',
        description: 'Design and deliver a team activity for your group.',
        category: 'Activity', xp: 10, image: null, sortOrder: 2,
        challenges: [
          { id: seedId('ch'), subBadgeId: 'sub-seed-0026', title: 'Plan a Team Activity', description: 'Design and write up a team activity plan for your group.', pts: 5, sortOrder: 0 },
          { id: seedId('ch'), subBadgeId: 'sub-seed-0026', title: 'Run the Activity', description: 'Lead and deliver the planned activity with your team.', pts: 5, sortOrder: 1 },
        ],
      },
    ],
  },
  {
    id: seedId('badge'),
    title: 'Esports Citizen',
    description: 'Sportsmanship, community and academy rules.',
    image: null,
    icon: 'verified_user',
    sequentialUnlock: true,
    subBadges: [
      {
        id: seedId('sub'), badgeId: 'badge-seed-0029', title: 'GGWP', info: 'Good Game, Well Played',
        description: 'Demonstrate good sportsmanship and positive communication.',
        category: 'Activity', xp: 4, image: null, sortOrder: 0,
        challenges: [
          { id: seedId('ch'), subBadgeId: 'sub-seed-0030', title: 'Good Sportsmanship', description: 'Demonstrate good sportsmanship after a competitive match.', pts: 2, sortOrder: 0 },
          { id: seedId('ch'), subBadgeId: 'sub-seed-0030', title: 'Positive Comms', description: 'Use positive communication throughout a full team match.', pts: 2, sortOrder: 1 },
        ],
      },
      {
        id: seedId('sub'), badgeId: 'badge-seed-0029', title: 'Good Sport', info: 'Fair play and sportsmanship',
        description: 'Show consistent fair play and respect for opponents.',
        category: 'Lesson', xp: 10, image: null, sortOrder: 1,
        challenges: [
          { id: seedId('ch'), subBadgeId: 'sub-seed-0033', title: 'Sportsmanship Lesson', description: 'Attend the sportsmanship lesson and complete the quiz.', pts: 5, sortOrder: 0 },
          { id: seedId('ch'), subBadgeId: 'sub-seed-0033', title: 'Fair Play Demo', description: 'Demonstrate fair play during a tournament match. Coach observed.', pts: 5, sortOrder: 1 },
        ],
      },
    ],
  },
  {
    id: seedId('badge'),
    title: 'Personal Development',
    description: 'Understanding strengths, weaknesses and goals through practice and mindset.',
    image: null,
    icon: 'psychology',
    sequentialUnlock: true,
    subBadges: [
      {
        id: seedId('sub'), badgeId: 'badge-seed-0036', title: 'Goal Getter', info: 'Set and work towards personal goals',
        description: 'Set personal gaming goals and track your progress towards them.',
        category: 'Activity', xp: 6, image: null, sortOrder: 0,
        challenges: [
          { id: seedId('ch'), subBadgeId: 'sub-seed-0037', title: 'Set 3 Goals', description: 'Write down 3 personal gaming goals for this term.', pts: 3, sortOrder: 0 },
          { id: seedId('ch'), subBadgeId: 'sub-seed-0037', title: 'Goal Review', description: 'Review progress on your goals with your coach.', pts: 3, sortOrder: 1 },
        ],
      },
      {
        id: seedId('sub'), badgeId: 'badge-seed-0036', title: 'Positivity Pioneer', info: 'Demonstrate positive thinking',
        description: 'Demonstrate a positive mindset before and during matches.',
        category: 'Activity', xp: 3, image: null, sortOrder: 1,
        challenges: [
          { id: seedId('ch'), subBadgeId: 'sub-seed-0040', title: 'Positive Mindset', description: 'Demonstrate positive thinking before a match.', pts: 2, sortOrder: 0 },
          { id: seedId('ch'), subBadgeId: 'sub-seed-0040', title: 'Bounce Back', description: 'Show resilience after a tough loss and keep a positive attitude.', pts: 1, sortOrder: 1 },
        ],
      },
    ],
  },
  {
    id: seedId('badge'),
    title: 'Digital Skills',
    description: 'Content creation, digital safety and online presence.',
    image: null,
    icon: 'terminal',
    sequentialUnlock: true,
    subBadges: [
      {
        id: seedId('sub'), badgeId: 'badge-seed-0043', title: 'Catch That Moment', info: 'Capture gameplay highlights',
        description: 'Learn to capture and share gameplay highlights.',
        category: 'Activity', xp: 3, image: null, sortOrder: 0,
        challenges: [
          { id: seedId('ch'), subBadgeId: 'sub-seed-0044', title: 'Screenshot Challenge', description: 'Take a gameplay screenshot and share with the group.', pts: 1, sortOrder: 0 },
          { id: seedId('ch'), subBadgeId: 'sub-seed-0044', title: 'Best Moment', description: 'Capture and describe your best gaming moment of the session.', pts: 2, sortOrder: 1 },
        ],
      },
      {
        id: seedId('sub'), badgeId: 'badge-seed-0043', title: 'Streaming Basics', info: 'Learn about streaming and content',
        description: 'Understand the basics of game streaming and content creation.',
        category: 'Lesson', xp: 10, image: null, sortOrder: 1,
        challenges: [
          { id: seedId('ch'), subBadgeId: 'sub-seed-0047', title: 'Streaming Setup Lesson', description: 'Attend the streaming setup lesson and take notes.', pts: 5, sortOrder: 0 },
          { id: seedId('ch'), subBadgeId: 'sub-seed-0047', title: 'Test Stream', description: 'Set up and run a test stream with coach supervision.', pts: 5, sortOrder: 1 },
        ],
      },
      {
        id: seedId('sub'), badgeId: 'badge-seed-0043', title: 'Content Creator', info: 'Create and share gaming content',
        description: 'Learn to create, edit and share gaming content across platforms.',
        category: 'Activity', xp: 10, image: null, sortOrder: 2,
        challenges: [
          { id: seedId('ch'), subBadgeId: 'sub-seed-0050', title: 'Create a Highlight Reel', description: 'Edit together a 60-second highlight reel from your gameplay.', pts: 5, sortOrder: 0 },
          { id: seedId('ch'), subBadgeId: 'sub-seed-0050', title: 'Share Your Content', description: 'Share your content on a platform and gather feedback.', pts: 5, sortOrder: 1 },
        ],
      },
    ],
  },
];

const badgeTiers = [
  { id: 'bt000001-0000-0000-0000-000000000001', name: 'Bronze',   minPts: 0,   maxPts: 30,   colour: '#cd7f32' },
  { id: 'bt000001-0000-0000-0000-000000000002', name: 'Silver',   minPts: 31,  maxPts: 70,   colour: '#c0c0c0' },
  { id: 'bt000001-0000-0000-0000-000000000003', name: 'Gold',     minPts: 71,  maxPts: 120,  colour: '#ffd700' },
  { id: 'bt000001-0000-0000-0000-000000000004', name: 'Platinum', minPts: 121, maxPts: null, colour: '#00e5ff' },
];

const groups = [
  {
    id: 'gr000001-0000-0000-0000-000000000001',
    name: 'Fortnite Competitive',
    label: 'Elite Academy',
    labelVariant: 'competitive',
    members: 12,
    maxMembers: 12,
    schedule: 'Daily Training',
    description: 'Tournament-ready squad. Daily scrims and ranked sessions.',
    icon: 'bolt',
    featured: true,
    live: true,
    game: 'Fortnite',
    ageRange: '13+',
    category: 'competitive',
    playerCount: 12,
    coach: 'Coach Mia',
  },
  {
    id: 'gr000001-0000-0000-0000-000000000002',
    name: 'Minecraft',
    label: 'Academy',
    labelVariant: 'academy',
    members: 24,
    maxMembers: null,
    schedule: null,
    description: 'Collaborative building & strategy sessions for all ages.',
    icon: 'category',
    featured: false,
    live: false,
    game: 'Minecraft',
    ageRange: '8+',
    category: 'junior',
    playerCount: 24,
    coach: 'Coach Dave',
  },
  {
    id: 'gr000001-0000-0000-0000-000000000003',
    name: 'Rocket League',
    label: 'Academy',
    labelVariant: 'academy',
    members: 16,
    maxMembers: null,
    schedule: null,
    description: 'Physics-based soccer with cars. Team mechanics focus.',
    icon: 'sports_esports',
    featured: false,
    live: false,
    game: 'Rocket League',
    ageRange: '8+',
    category: 'junior',
    playerCount: 16,
    coach: 'Coach Dave',
  },
  {
    id: 'gr000001-0000-0000-0000-000000000004',
    name: 'Media and Content',
    label: 'Creative',
    labelVariant: 'creative',
    members: 8,
    maxMembers: null,
    schedule: null,
    description: 'Building the brand of tomorrow.',
    icon: 'videocam',
    featured: false,
    live: true,
    game: 'Media',
    ageRange: '13+',
    category: 'media',
    playerCount: 8,
    coach: 'Coach Mia',
  },
  {
    id: 'gr000001-0000-0000-0000-000000000005',
    name: '13+ Casual Gaming Drop-in',
    label: 'Community',
    labelVariant: 'community',
    members: 45,
    maxMembers: null,
    schedule: null,
    description: 'Safe space for socialising and casual play.',
    icon: 'groups',
    featured: false,
    live: false,
    game: 'Mixed',
    ageRange: '13+',
    category: 'casual',
    playerCount: 45,
    coach: 'Volunteer',
  },
  {
    id: 'gr000001-0000-0000-0000-000000000006',
    name: 'Rocket League Competitive',
    label: 'Tier 1 Competitive',
    labelVariant: 'competitive',
    members: 9,
    maxMembers: null,
    schedule: 'Tue / Thu',
    description: 'High-performance team competing in regional leagues.',
    icon: 'star',
    featured: false,
    live: false,
    game: 'Rocket League',
    ageRange: '13+',
    category: 'competitive',
    playerCount: 9,
    coach: 'Coach Dave',
  },
  {
    id: 'gr000001-0000-0000-0000-000000000007',
    name: 'Fortnite',
    label: 'Academy',
    labelVariant: 'academy',
    members: 32,
    maxMembers: null,
    schedule: 'Mon / Wed / Fri',
    description: 'Entry-level squad building core mechanics and matchplay.',
    icon: 'landscape',
    featured: false,
    live: false,
    game: 'Fortnite',
    ageRange: '8+',
    category: 'junior',
    playerCount: 32,
    coach: 'Coach Mia',
  },
];

const groupRecentActivity = [
  {
    type: 'join',
    text: '"Jaxson_Gamer" joined Minecraft Academy',
    time: '2 minutes ago',
    variant: 'primary',
  },
  {
    type: 'update',
    text: 'Fortnite Competitive session moved to 18:00',
    time: '1 hour ago',
    variant: 'secondary',
  },
  {
    type: 'create',
    text: '"Media and Content" group initialized',
    time: 'Yesterday',
    variant: 'tertiary',
  },
];

module.exports = {
  centres,
  metadata,
  badgeCategories,
  games,
  levelDefinitions,
  modules,
  challenges,
  users,
  credentials,
  submissions,
  badges,
  badgeTiers,
  groups,
  groupRecentActivity,
};
