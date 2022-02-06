const fs = require('fs')
const day = require('../../util/dayjs')
const _cacheFile = 'showcasecache.json'
const log = msg => console.log(`showcasedao: ${msg}`)

const ENTRIES = "entries"

// Barebones default state
let showcaseCache = {}

// Load old cache on init
try {
  showcaseCache = JSON.parse(fs.readFileSync(_cacheFile))
} catch (error) {
  log(`if ENOENT this is expected - could not load showcase data from old cache: ${error}`)
}

// Simple persistence layer
function _saveShowcaseState() {
  try {
    fs.writeFileSync(_cacheFile, JSON.stringify(showcaseCache, null, 2))
  } catch(error) {
    log(`error saving showcase: ${error}`)
  }
}

exports.resetQueue = function(channelid) {
  log(`emptying showcase queue for channel [${channelid}]`)
  showcaseCache[channelid] = {}
  _saveShowcaseState()
}

exports.saveLinkForUser = function(channelid, userid, username, link) {
  // TODO:
  let entryExisted = !!showcaseCache[channelid][showcaseKEY][userid] // For smarter output
  showcaseCache[channelid][showcaseKEY][userid] = {
    'ts': new Date(),
    'link': link,
    'displayname': username
  }
  _saveShowcaseState()
  let numEntries = _queueSize(channelid)
  if (entryExisted) {
    return `thanks for the update, saved your new entry! (${numEntries} entries)`
  } else {
    return `welcome to the battle! (${numEntries} entries)`
  }
}

exports.saveNotesForUser = function(channelid, userid, username, notes) {
  // TODO:
  let entryExisted = !!showcaseCache[channelid][showcaseKEY][userid] // For smarter output
  showcaseCache[channelid][showcaseKEY][userid] = {
    'ts': new Date(),
    'link': link,
    'displayname': username
  }
  _saveShowcaseState()
  let numEntries = _queueSize(channelid)
  if (entryExisted) {
    return `thanks for the update, saved your new entry! (${numEntries} entries)`
  } else {
    return `welcome to the battle! (${numEntries} entries)`
  }
}

exports.getSingleShowcaseEntry = function(channelid) {
  if (!showcaseCache[channelid]) return false
  const entries = showcaseCache[channelid][showcaseKEY]
}

/// EVERYTHING BELOW THIS LINE IS FOR FUTURE IMPLEMENTATION

/*
  - channel is open to things until closed for it
  - cache:{ serveridnotpresent } = open
  - cache:{ id: { object } } = open
  - cache:{ id: false } = closed (or a sane constants.FEATURE_DISABLED_IN_CHANNEL for readability)
*/
exports.isChannelOpenForShowcase = function(channelid) {
  return true
}

exports.openChannelForShowcase = function(channelid) {
  //TODO mv disk cache to cache.backup
  _resetBattleRegistration(channelid)
  let battleExisted = _isBattleInProgress(channelid)
  // Super simple template
  let battleTemplate = {}
  battleTemplate[showcaseKEY] = {}
  battleTemplate[VOTECACHEKEY] = {}
  battleTemplate[SUB_DL_KEY] = false
  battleTemplate[VOTE_DL_KEY] = false
  // BAM lock and load!
  showcaseCache[channelid] = battleTemplate
  _saveShowcaseState()
  if (!battleExisted) {
    return `looks like the first showcase queue in this channel, lets goooo!`
  } else {
    return `the previous showcase queue has been DUMPED, a new session has started!`
  }
}

exports.closeChannelForShowcase = function(channelid) {
  if (channelid in showcaseCache) {
    log(`stopping showcase in ${channelid}`)
    showcaseCache[channelid] = false
    _saveShowcaseState()
    return `this showcase channel has been deactivated, !fb open to reactivate`
  }
  return `showcase is already deactivated, !fb open to get this show on the road`
}

/*
  Cooldown feature stubs for future work
*/
exports.queueUserForCooldown = function(channelid, userid) {
  // TODO put user in hotseat for cooldown
  return true
}

exports.removeUserFromCooldownQueue = function(channelid, userid) {
  // TODO put user in hotseat for cooldown
  return true
}

exports.commitCooldownQueue = function(channelid) {
  // TODO put cooldown queue in actual cooldown state, set date for each user per cooldownTime
  return true
}

exports.isUserInCooldown = function(channelid, userid) {
  // TODO check and return { ts: ts, span: span } or false
  return true
}

exports.setShowcaseCooldownTime = function(channelid, span) {
  // TODO save new span
  return true
}

exports.getShowcaseCooldownTime = function(channelid) {
  // TODO read it out
  return '7d'
}

/*
  Selection adjustment feature stubsj for future work
*/
exports.setSelectionMethod = function(channelid, method) {
  // TODO validate in CONTROLLER for weighted SPAN, chrono, random
  return true
}

exports.getSelectionMethod = function(channelid) {
  // TODO read it out
  return 'random'
}

// Trick for using this function locally and as export
function _getQueueSize(channelid) {
  if (_isShowcaseChannel(channelid) && showcaseCache[channelid][showcaseKEY]) {
    const numEntries = Object.keys(showcaseCache[channelid][showcaseKEY]).length
    return numEntries
  }
  return 0
}
exports.getQueueSize = _getQueueSize