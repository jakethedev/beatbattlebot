const fs = require('fs')
const day = require('../../util/dayjs')
const _cacheFile = 'feedbackcache.json'
const log = msg => console.log(`feedbackdao: ${msg}`)

const ENTRYKEY = "entries"
const COOLDOWNKEY = "cooldown"

// Barebones default state
let feedbackMap = {}

// Load old cache on init
try {
  feedbackMap = JSON.parse(fs.readFileSync(_cacheFile))
} catch (error) {
  log(`if ENOENT this is expected - could not load feedback data from old cache: ${error}`)
}

// Simple persistence layer
function _saveFeedbackState() {
  try {
    fs.writeFileSync(_cacheFile, JSON.stringify(feedbackMap, null, 2))
  } catch(error) {
    log(`error saving cache: ${error}`)
  }
}

exports.setFeedbackOrder = function(serverid, type) {
  // TODO weighted SPAN, chrono, random
}

exports.getFeedbackOrder = function(serverid) {
  // TODO weighted SPAN, chrono, random
  return FEEDBACK_ORDER_RANDOM
}

// TODO: everything below this line
function _resetCooldown(userid) {
  if (!battleMap[VOTEREGKEY]) {
    log('adding vote reg first time')
    battleMap[VOTEREGKEY] = {}
  }
  let voteRegistry = battleMap[VOTEREGKEY]
  for (let entrant in voteRegistry) {
    if (voteRegistry[entrant] == battleName) {
      delete voteRegistry[entrant]
    }
  }
  _saveBattleState()
}

// Battle data reset and core "structure" setup
function _setCooldown(userid) {
  //TODO mv disk cache to cache.backup
  _resetBattleRegistration(battleName)
  let battleExisted = _isBattleInProgress(battleName)
  // Super simple template
  let battleTemplate = {}
  battleTemplate[ENTRYKEY] = {}
  battleTemplate[VOTECACHEKEY] = {}
  battleTemplate[SUB_DL_KEY] = false
  battleTemplate[VOTE_DL_KEY] = false
  // BAM lock and load!
  battleMap[battleName] = battleTemplate
  _saveBattleState()
  if (!battleExisted) {
    return `looks like the first battle in this channel, lets goooo!`
  } else {
    return `the old battle is OVER, a new round has started!`
  }
}
//exports.newBattle = _resetBattleState

// Stop battles for an active battle channel
function _deactivateFeedback(battleName) {
  if (battleName in battleMap) {
    log(`deactivating ${battleName}`)
    delete battleMap[battleName]
    _saveBattleState()
    return `this battle has been deactivated, !newbattle to reactivate`
  }
  return `battle is already deactivated, !newbattle to get this party started :sparkle:`
}
exports.deactivateFeedback = _deactivateFeedback

// Fast way to check "is this channel battle-ready"
function _isBattleChannel(battleName) {
  return battleName in battleMap
}
exports.isBattleChannel = _isBattleChannel

// Trick for using this function locally and as export
function _battleSize(battleName) {
  if (_isBattleChannel(battleName) && battleMap[battleName][ENTRYKEY]) {
    const numEntries = Object.keys(battleMap[battleName][ENTRYKEY]).length
    return numEntries
  }
  return 0
}
exports.getBattleSize = _battleSize

// Quick util for seeing if a battle is active
function _isBattleInProgress(battleName) {
  if (!_isBattleChannel(battleName)) {
    log(`notice: '${battleName}' checked for activity and is not in the map or has no entries`)
    return false
  }
  let battleHasEntries = _battleSize(battleName) > 0
  log(`btl entries: ${battleHasEntries}`)
  return battleHasEntries
}
exports.isBattleActive = _isBattleInProgress

exports.isFeedbackOpen = function(){
  //TODO: the thing
  return true
}

exports.addEntry = function(entrantId, entrantName, link, battleName) {
  // Expects caller to verify that submissions are allowed
  let entryExisted = !!battleMap[battleName][ENTRYKEY][entrantId] // For smarter output
  battleMap[battleName][ENTRYKEY][entrantId] = {
    'ts': new Date(),
    'link': link,
    'displayname': entrantName
  }
  _saveBattleState()
  let numEntries = _battleSize(battleName)
  if (entryExisted) {
    return `thanks for the update, saved your new entry! (${numEntries} entries)`
  } else {
    return `welcome to the battle! (${numEntries} entries)`
  }
}

exports.getEntriesFor = function(battleName) {
  return battleMap[battleName][ENTRYKEY]
}

function _getBattleIdByVoter(userId) {
  return battleMap[VOTEREGKEY][userId] || null
}
exports.getBattleIdByVoter = _getBattleIdByVoter
exports.isVoterRegistered = (userid) => _getBattleIdByVoter(userid) != null

exports.registerVoter = function(userId, battleName){
  if (!VOTEREGKEY in battleMap) {
    battleMap[VOTEREGKEY] = {} // JIT assumption management
  }
  // mapping by userId like this avoids dual-registration
  battleMap[VOTEREGKEY][userId] = battleName
  _saveBattleState()
}

exports.voteAndDeregister = function(userId, voteIdxArray){
  const battleName = _getBattleIdByVoter(userId)
  // TODO finalize where this validation goes
  if (!battleName) {
    return false
  }
  battleMap[battleName][VOTECACHEKEY][userId] = voteIdxArray
  // Revoking vote registration tag
  delete battleMap[VOTEREGKEY][userId]
  _saveBattleState()
  // TODO no UI logic in the database what is this rookie hour? jeepers
  return true
}
