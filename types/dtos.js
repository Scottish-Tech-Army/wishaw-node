/**
 * @file types/dtos.js
 * JSDoc type definitions aligned with Spring Boot backend DTO contracts.
 * Field names here MUST match backend response field names exactly.
 * Update this file first when backend DTOs change, then fix service mappers.
 */

/**
 * @typedef {Object} AuthResponse
 * @property {number} id
 * @property {string} email
 * @property {string} displayName
 * @property {'SUPER_ADMIN'|'CENTRE_ADMIN'|'PLAYER'|'PARENT'} role
 * @property {string} [token]        - JWT token if backend uses token auth
 * @property {number} [playerId]     - Populated when role === 'PLAYER'
 * @property {number} [parentId]     - Populated when role === 'PARENT'
 */

/**
 * @typedef {Object} CentreSummary
 * @property {number}  id
 * @property {string}  name
 * @property {string}  location
 * @property {boolean} active
 */

/**
 * @typedef {Object} GroupSummary
 * @property {number} id
 * @property {string} name
 * @property {number} centreId
 * @property {string} centreName
 * @property {string} ageRange
 */

/**
 * @typedef {Object} PlayerSummary
 * @property {number}  id
 * @property {string}  displayName
 * @property {string}  externalRef   - Used for CSV import mapping
 * @property {string}  email
 * @property {number}  groupId
 * @property {string}  groupName
 * @property {number}  centreId
 * @property {string}  centreName
 * @property {boolean} active
 * @property {number}  xp
 * @property {string|null} [avatarUrl]
 * @property {string|null} [imageUrl]
 */

/**
 * @typedef {Object} BadgeCategory
 * @property {string} id
 * @property {string} name
 * @property {string} color
 * @property {string} icon
 */

/**
 * @typedef {Object} ModuleSummary
 * @property {number}  id
 * @property {string}  name
 * @property {string}  description
 * @property {string}  badgeCategory  - matches BadgeCategory.id
 * @property {number}  totalXp
 * @property {boolean} active
 */

/**
 * @typedef {Object} ChallengeSummary
 * @property {number}   id
 * @property {number}   moduleId
 * @property {string}   name
 * @property {string}   description
 * @property {number}   points
 * @property {string}   badgeCategory
 * @property {string[]} skills
 */

/**
 * @typedef {Object} ScheduleItem
 * @property {number} id
 * @property {number} moduleId
 * @property {string} moduleName
 * @property {string} dayOfWeek
 * @property {string} startTime  - HH:mm
 * @property {string} endTime    - HH:mm
 * @property {number} centreId
 * @property {string} centreName
 */

/**
 * @typedef {Object} AwardRecord
 * @property {number} playerId
 * @property {string} playerName
 * @property {number} challengeId
 * @property {string} challengeName
 * @property {number} moduleId
 * @property {string} moduleName
 * @property {string} badgeCategory
 * @property {number} pointsAwarded
 * @property {string} awardedAt     - ISO date string YYYY-MM-DD
 */

/**
 * @typedef {Object} PlayerProgress
 * @property {number}       playerId
 * @property {AwardRecord[]} awards
 * @property {Object.<string, {category: BadgeCategory, points: number, awards: AwardRecord[]}>} byCategory
 * @property {number}       totalXp
 */

/**
 * @typedef {Object} LeaderboardEntry
 * @property {number} rank
 * @property {number} playerId
 * @property {string} displayName
 * @property {string} groupName
 * @property {string} centreName
 * @property {number} xp
 * @property {string|null} [avatarUrl]
 * @property {string|null} [imageUrl]
 */

/**
 * @typedef {Object} ParentLink
 * @property {number} id
 * @property {number} parentId
 * @property {string} parentName
 * @property {string} parentEmail
 * @property {number} playerId
 * @property {string} playerName
 */

/**
 * @typedef {Object} ImportPreviewRow
 * @property {string}   displayName
 * @property {string}   externalRef
 * @property {string}   email
 * @property {string}   groupId
 * @property {string}   centreId
 * @property {string[]} _errors       - Validation errors; empty = valid
 * @property {'CREATE'|'UPDATE'} _status
 * @property {PlayerSummary|null} _existingPlayer
 */

/**
 * @typedef {Object} ImportSummary
 * @property {number} created
 * @property {number} updated
 * @property {number} skipped
 */

module.exports = {}; // types only - no runtime exports needed
