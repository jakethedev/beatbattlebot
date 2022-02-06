const fs = require('fs')
const day = require('../../util/dayjs')
const _cacheFile = 'feedbackcache.json'
const log = msg => console.log(`feedbackdao: ${msg}`)

const FEEDBACKKEY = "entries"
const COOLDOWNKEY = "cooldown"

// Barebones default state
let feedbackCache = {}

// Load old cache on init
try {
  feedbackCache = JSON.parse(fs.readFileSync(_cacheFile))
} catch (error) {
  log(`if ENOENT this is expected - could not load feedback data from old cache: ${error}`)
}

// Simple persistence layer
function _saveFeedbackState() {
  try {
    fs.writeFileSync(_cacheFile, JSON.stringify(feedbackCache, null, 2))
  } catch(error) {
    log(`error saving feedback data: ${error}`)
  }
}

exports.resetQueue = function(channelid) {
  log(`emptying feedback queue for channel [${channelid}]`)
  feedbackCache[channelid] = {}
  _saveFeedbackState()
}

exports.saveLinkForUser = function(channelid, userid, username, link) {
  // TODO:
  let entryExisted = !!feedbackCache[channelid][FEEDBACKKEY][userid] // For smarter output
  feedbackCache[channelid][FEEDBACKKEY][userid] = {
    'ts': new Date(),
    'link': link,
    'displayname': username
  }
  _saveFeedbackState()
  let numEntries = _queueSize(channelid)
  if (entryExisted) {
    return `thanks for the update, saved your new entry! (${numEntries} entries)`
  } else {
    return `welcome to the battle! (${numEntries} entries)`
  }
}

exports.saveNotesForUser = function(channelid, userid, username, notes) {
  // TODO:
  let entryExisted = !!feedbackCache[channelid][FEEDBACKKEY][userid] // For smarter output
  feedbackCache[channelid][FEEDBACKKEY][userid] = {
    'ts': new Date(),
    'link': link,
    'displayname': username
  }
  _saveFeedbackState()
  let numEntries = _queueSize(channelid)
  if (entryExisted) {
    return `thanks for the update, saved your new entry! (${numEntries} entries)`
  } else {
    return `welcome to the battle! (${numEntries} entries)`
  }
}

exports.getSingleFeedbackEntry = function(channelid) {
  if (!feedbackCache[channelid]) return false
  const entries = feedbackCache[channelid][FEEDBACKKEY]
}

/// EVERYTHING BELOW THIS LINE IS FOR FUTURE IMPLEMENTATION

/*
  - channel is open to things until closed for it
  - cache:{ serveridnotpresent } = open
  - cache:{ id: { object } } = open
  - cache:{ id: false } = closed (or a sane constants.FEATURE_DISABLED_IN_CHANNEL for readability)
*/
exports.isChannelOpenForFeedback = function(channelid) {
  return true
}

exports.openChannelForFeedback = function(channelid) {
  //TODO mv disk cache to cache.backup
  _resetBattleRegistration(channelid)
  let battleExisted = _isBattleInProgress(channelid)
  // Super simple template
  let battleTemplate = {}
  battleTemplate[FEEDBACKKEY] = {}
  battleTemplate[VOTECACHEKEY] = {}
  battleTemplate[SUB_DL_KEY] = false
  battleTemplate[VOTE_DL_KEY] = false
  // BAM lock and load!
  feedbackCache[channelid] = battleTemplate
  _saveFeedbackState()
  if (!battleExisted) {
    return `looks like the first feedback queue in this channel, lets goooo!`
  } else {
    return `the previous feedback queue has been DUMPED, a new session has started!`
  }
}

exports.closeChannelForFeedback = function(channelid) {
  if (channelid in feedbackCache) {
    log(`stopping feedback in ${channelid}`)
    feedbackCache[channelid] = false
    _saveFeedbackState()
    return `this feedback channel has been deactivated, !fb open to reactivate`
  }
  return `feedback is already deactivated, !fb open to get this show on the road`
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

exports.setFeedbackCooldownTime = function(channelid, span) {
  // TODO save new span
  return true
}

exports.getFeedbackCooldownTime = function(channelid) {
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
  if (_isFeedbackChannel(channelid) && feedbackCache[channelid][FEEDBACKKEY]) {
    const numEntries = Object.keys(feedbackCache[channelid][FEEDBACKKEY]).length
    return numEntries
  }
  return 0
}
exports.getQueueSize = _getQueueSize