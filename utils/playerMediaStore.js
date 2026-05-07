var fs = require('fs/promises');
var path = require('path');

var MEDIA_DIR = path.join(__dirname, '..', 'public', 'uploads', 'player-media');
var METADATA_DIR = path.join(__dirname, '..', 'data');
var METADATA_PATH = path.join(METADATA_DIR, 'player-media.json');
var PUBLIC_URL_PREFIX = '/uploads/player-media/';
var SUPPORTED_MIME_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif'
};

async function ensureStore() {
  await fs.mkdir(MEDIA_DIR, { recursive: true });
  await fs.mkdir(METADATA_DIR, { recursive: true });
  try {
    await fs.access(METADATA_PATH);
  } catch (_) {
    await fs.writeFile(METADATA_PATH, '{}', 'utf8');
  }
}

async function readMetadata() {
  await ensureStore();
  try {
    var raw = await fs.readFile(METADATA_PATH, 'utf8');
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

async function writeMetadata(metadata) {
  await ensureStore();
  await fs.writeFile(METADATA_PATH, JSON.stringify(metadata, null, 2), 'utf8');
}

function getMediaEntry(metadata, playerId) {
  return metadata[String(playerId)] || null;
}

function getExtension(file) {
  if (file && file.mimetype && SUPPORTED_MIME_TYPES[file.mimetype]) {
    return SUPPORTED_MIME_TYPES[file.mimetype];
  }

  var originalName = (file && (file.originalname || file.filename)) || '';
  var ext = path.extname(originalName).toLowerCase();
  return ext || '.bin';
}

function buildFilename(playerId, mediaType, file) {
  return ['player', String(playerId), mediaType, Date.now()].join('-') + getExtension(file);
}

function getFilePathFromUrl(publicUrl) {
  if (!publicUrl || publicUrl.indexOf(PUBLIC_URL_PREFIX) !== 0) {
    return null;
  }

  return path.join(MEDIA_DIR, publicUrl.slice(PUBLIC_URL_PREFIX.length));
}

async function removeStoredFile(publicUrl) {
  var filePath = getFilePathFromUrl(publicUrl);
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (_) {
    // Ignore missing files to keep player updates resilient.
  }
}

function normalisePlayer(player, mediaEntry) {
  if (!player) {
    return player;
  }

  var avatarUrl = (mediaEntry && mediaEntry.avatarUrl) || player.avatarUrl || null;
  var imageUrl = (mediaEntry && mediaEntry.imageUrl) || player.imageUrl || null;
  var profileImageUrl = avatarUrl || imageUrl || null;
  var profileImageKind = avatarUrl ? 'avatar' : imageUrl ? 'image' : 'none';

  return Object.assign({}, player, {
    avatarUrl: avatarUrl,
    imageUrl: imageUrl,
    profileImageUrl: profileImageUrl,
    profileImageKind: profileImageKind
  });
}

async function applyToPlayer(player) {
  if (!player || !player.id) {
    return player;
  }

  var metadata = await readMetadata();
  return normalisePlayer(player, getMediaEntry(metadata, player.id));
}

async function applyToPlayers(players) {
  if (!Array.isArray(players) || players.length === 0) {
    return players || [];
  }

  var metadata = await readMetadata();
  return players.map(function (player) {
    return normalisePlayer(player, getMediaEntry(metadata, player.id));
  });
}

function validateImageUpload(file) {
  if (!file) {
    var missingFileError = new Error('Choose an image file to upload.');
    missingFileError.status = 400;
    throw missingFileError;
  }

  if (!file.mimetype || !SUPPORTED_MIME_TYPES[file.mimetype]) {
    var invalidFileError = new Error('Use a JPG, PNG, GIF, or WebP image.');
    invalidFileError.status = 400;
    throw invalidFileError;
  }
}

async function savePlayerMedia(playerId, file, mediaType) {
  validateImageUpload(file);

  if (mediaType !== 'avatar' && mediaType !== 'image') {
    var invalidMediaTypeError = new Error('Choose whether to save the file as an avatar or an image.');
    invalidMediaTypeError.status = 400;
    throw invalidMediaTypeError;
  }

  await ensureStore();

  var metadata = await readMetadata();
  var key = String(playerId);
  var currentEntry = metadata[key] || {};
  var filename = buildFilename(playerId, mediaType, file);
  var publicUrl = PUBLIC_URL_PREFIX + filename;

  await fs.writeFile(path.join(MEDIA_DIR, filename), file.buffer);
  await removeStoredFile(currentEntry[mediaType === 'avatar' ? 'avatarUrl' : 'imageUrl']);

  metadata[key] = Object.assign({}, currentEntry, {
    updatedAt: new Date().toISOString(),
    avatarUrl: mediaType === 'avatar' ? publicUrl : currentEntry.avatarUrl || null,
    imageUrl: mediaType === 'image' ? publicUrl : currentEntry.imageUrl || null
  });

  await writeMetadata(metadata);
  return metadata[key];
}

async function removePlayerMedia(playerId) {
  var metadata = await readMetadata();
  var key = String(playerId);
  var currentEntry = metadata[key];

  if (!currentEntry) {
    return;
  }

  await Promise.all([
    removeStoredFile(currentEntry.avatarUrl),
    removeStoredFile(currentEntry.imageUrl)
  ]);

  delete metadata[key];
  await writeMetadata(metadata);
}

module.exports = {
  applyToPlayer: applyToPlayer,
  applyToPlayers: applyToPlayers,
  savePlayerMedia: savePlayerMedia,
  removePlayerMedia: removePlayerMedia
};