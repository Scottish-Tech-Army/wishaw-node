// Centralized mock data for all services
// This data resets on server restart

const users = [
  { id: 1, email: 'admin@wishaw.org', password: 'admin123', displayName: 'Emma Williamson', role: 'SUPER_ADMIN' },
  { id: 2, email: 'coach@wishaw.org', password: 'coach123', displayName: 'James Murray', role: 'CENTRE_ADMIN' },
  { id: 3, email: 'player1@wishaw.org', password: 'player123', displayName: 'Alex Smith', role: 'PLAYER', playerId: 1 },
  { id: 4, email: 'player2@wishaw.org', password: 'player123', displayName: 'Jordan Lee', role: 'PLAYER', playerId: 2 },
  { id: 5, email: 'parent1@wishaw.org', password: 'parent123', displayName: 'Sarah Smith', role: 'PARENT', parentId: 1 }
];

const centres = [
  { id: 1, name: 'Wishaw YMCA', location: 'Wishaw, North Lanarkshire', active: true },
  { id: 2, name: 'Glasgow YMCA', location: 'Glasgow City Centre', active: true },
  { id: 3, name: 'Edinburgh YMCA', location: 'Edinburgh', active: false }
];

const groups = [
  { id: 1, name: 'Wishaw Wolves', centreId: 1, centreName: 'Wishaw YMCA', ageRange: '10-14' },
  { id: 2, name: 'Wishaw Eagles', centreId: 1, centreName: 'Wishaw YMCA', ageRange: '14-18' },
  { id: 3, name: 'Glasgow Titans', centreId: 2, centreName: 'Glasgow YMCA', ageRange: '10-14' }
];

const players = [
  { id: 1, displayName: 'Alex Smith', externalRef: 'EXT001', email: 'alex@example.com', groupId: 1, groupName: 'Wishaw Wolves', centreId: 1, centreName: 'Wishaw YMCA', active: true, xp: 1250, avatarUrl: null, imageUrl: null },
  { id: 2, displayName: 'Jordan Lee', externalRef: 'EXT002', email: 'jordan@example.com', groupId: 1, groupName: 'Wishaw Wolves', centreId: 1, centreName: 'Wishaw YMCA', active: true, xp: 980, avatarUrl: null, imageUrl: null },
  { id: 3, displayName: 'Sam Taylor', externalRef: 'EXT003', email: 'sam@example.com', groupId: 2, groupName: 'Wishaw Eagles', centreId: 1, centreName: 'Wishaw YMCA', active: true, xp: 1500, avatarUrl: null, imageUrl: null },
  { id: 4, displayName: 'Riley Brown', externalRef: 'EXT004', email: 'riley@example.com', groupId: 3, groupName: 'Glasgow Titans', centreId: 2, centreName: 'Glasgow YMCA', active: true, xp: 720, avatarUrl: null, imageUrl: null },
  { id: 5, displayName: 'Casey Wilson', externalRef: 'EXT005', email: 'casey@example.com', groupId: 2, groupName: 'Wishaw Eagles', centreId: 1, centreName: 'Wishaw YMCA', active: false, xp: 300, avatarUrl: null, imageUrl: null }
];

const parentLinks = [
  { id: 1, parentId: 1, parentName: 'Sarah Smith', parentEmail: 'parent1@wishaw.org', playerId: 1, playerName: 'Alex Smith' },
  { id: 2, parentId: 1, parentName: 'Sarah Smith', parentEmail: 'parent1@wishaw.org', playerId: 2, playerName: 'Jordan Lee' }
];

const badgeCategories = [
  { id: 'respect', name: 'Respect', color: '#e74c3c', icon: '🔴' },
  { id: 'teamwork', name: 'Teamwork', color: '#3498db', icon: '🔵' },
  { id: 'communication', name: 'Communication', color: '#2ecc71', icon: '🟢' },
  { id: 'leadership', name: 'Leadership', color: '#f39c12', icon: '🟡' },
  { id: 'sportsmanship', name: 'Sportsmanship', color: '#9b59b6', icon: '🟣' }
];

const modules = [
  { id: 1, name: 'Respect in Gaming', description: 'Learn to show respect to opponents and teammates online.', badgeCategory: 'respect', totalXp: 500, active: true },
  { id: 2, name: 'Team Play Basics', description: 'Understand the fundamentals of teamwork in esports.', badgeCategory: 'teamwork', totalXp: 500, active: true },
  { id: 3, name: 'Effective Communication', description: 'Develop clear and positive communication skills.', badgeCategory: 'communication', totalXp: 500, active: true },
  { id: 4, name: 'Leading the Team', description: 'Build leadership skills through game strategy and mentoring.', badgeCategory: 'leadership', totalXp: 500, active: true },
  { id: 5, name: 'Fair Play', description: 'Demonstrate sportsmanship in competition and practice.', badgeCategory: 'sportsmanship', totalXp: 500, active: true }
];

const challenges = [
  { id: 1, moduleId: 1, name: 'Respectful Chat', description: 'Use positive language in 5 consecutive matches.', points: 100, badgeCategory: 'respect', skills: ['communication', 'self-control'] },
  { id: 2, moduleId: 1, name: 'GG Always', description: 'Say "Good Game" after every match for a week.', points: 50, badgeCategory: 'respect', skills: ['habit-building'] },
  { id: 3, moduleId: 2, name: 'Team Callouts', description: 'Make helpful callouts to teammates during 3 matches.', points: 100, badgeCategory: 'teamwork', skills: ['communication', 'awareness'] },
  { id: 4, moduleId: 2, name: 'Support Role', description: 'Play a support role in 5 team games.', points: 75, badgeCategory: 'teamwork', skills: ['selflessness'] },
  { id: 5, moduleId: 3, name: 'Clear Comms', description: 'Lead a team briefing before a match.', points: 100, badgeCategory: 'communication', skills: ['public speaking'] },
  { id: 6, moduleId: 4, name: 'Shot Caller', description: 'Make strategic decisions for the team in 3 matches.', points: 150, badgeCategory: 'leadership', skills: ['strategy', 'confidence'] },
  { id: 7, moduleId: 5, name: 'Graceful Loss', description: 'Congratulate the winning team after a loss.', points: 75, badgeCategory: 'sportsmanship', skills: ['emotional control'] },
  { id: 8, moduleId: 5, name: 'Help a Newcomer', description: 'Mentor a new player through their first session.', points: 100, badgeCategory: 'sportsmanship', skills: ['mentoring', 'patience'] }
];

const schedule = [
  { id: 1, moduleId: 1, moduleName: 'Respect in Gaming', dayOfWeek: 'Monday', startTime: '16:00', endTime: '17:30', centreId: 1, centreName: 'Wishaw YMCA' },
  { id: 2, moduleId: 2, moduleName: 'Team Play Basics', dayOfWeek: 'Tuesday', startTime: '16:00', endTime: '17:30', centreId: 1, centreName: 'Wishaw YMCA' },
  { id: 3, moduleId: 3, moduleName: 'Effective Communication', dayOfWeek: 'Wednesday', startTime: '16:00', endTime: '17:30', centreId: 1, centreName: 'Wishaw YMCA' },
  { id: 4, moduleId: 4, moduleName: 'Leading the Team', dayOfWeek: 'Thursday', startTime: '16:00', endTime: '17:30', centreId: 2, centreName: 'Glasgow YMCA' },
  { id: 5, moduleId: 5, moduleName: 'Fair Play', dayOfWeek: 'Friday', startTime: '15:00', endTime: '16:30', centreId: 1, centreName: 'Wishaw YMCA' }
];

const awardProgress = [
  { playerId: 1, playerName: 'Alex Smith', challengeId: 1, challengeName: 'Respectful Chat', moduleId: 1, moduleName: 'Respect in Gaming', badgeCategory: 'respect', pointsAwarded: 100, awardedAt: '2026-03-15' },
  { playerId: 1, playerName: 'Alex Smith', challengeId: 2, challengeName: 'GG Always', moduleId: 1, moduleName: 'Respect in Gaming', badgeCategory: 'respect', pointsAwarded: 50, awardedAt: '2026-03-18' },
  { playerId: 1, playerName: 'Alex Smith', challengeId: 3, challengeName: 'Team Callouts', moduleId: 2, moduleName: 'Team Play Basics', badgeCategory: 'teamwork', pointsAwarded: 100, awardedAt: '2026-03-20' },
  { playerId: 2, playerName: 'Jordan Lee', challengeId: 1, challengeName: 'Respectful Chat', moduleId: 1, moduleName: 'Respect in Gaming', badgeCategory: 'respect', pointsAwarded: 100, awardedAt: '2026-03-16' },
  { playerId: 2, playerName: 'Jordan Lee', challengeId: 4, challengeName: 'Support Role', moduleId: 2, moduleName: 'Team Play Basics', badgeCategory: 'teamwork', pointsAwarded: 75, awardedAt: '2026-03-22' },
  { playerId: 3, playerName: 'Sam Taylor', challengeId: 5, challengeName: 'Clear Comms', moduleId: 3, moduleName: 'Effective Communication', badgeCategory: 'communication', pointsAwarded: 100, awardedAt: '2026-03-10' },
  { playerId: 3, playerName: 'Sam Taylor', challengeId: 6, challengeName: 'Shot Caller', moduleId: 4, moduleName: 'Leading the Team', badgeCategory: 'leadership', pointsAwarded: 150, awardedAt: '2026-03-12' },
  { playerId: 3, playerName: 'Sam Taylor', challengeId: 7, challengeName: 'Graceful Loss', moduleId: 5, moduleName: 'Fair Play', badgeCategory: 'sportsmanship', pointsAwarded: 75, awardedAt: '2026-03-14' },
  { playerId: 4, playerName: 'Riley Brown', challengeId: 8, challengeName: 'Help a Newcomer', moduleId: 5, moduleName: 'Fair Play', badgeCategory: 'sportsmanship', pointsAwarded: 100, awardedAt: '2026-03-25' }
];

module.exports = {
  users,
  centres,
  groups,
  players,
  parentLinks,
  badgeCategories,
  modules,
  challenges,
  schedule,
  awardProgress
};
