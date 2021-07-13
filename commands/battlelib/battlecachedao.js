const fs = require('fs')
const day = require('../../util/dayjs')
const _cacheFile = 'battlecache.json'
const log = msg => console.log(`bcache: ${msg}`)

const ENTRYKEY = "entries"
const VOTEKEY = "votes"
const VOTEREGKEY = "votereg"
const SUB_DL_KEY = "subdeadline"
const VOTE_DL_KEY = "votedeadline"

// Constant for use as a return code on getBattleIDbyVoter, see usages in battlecontroller
const USERNOTREGISTERED = "nobodyhome"
exports.USERNOTREGISTERED = USERNOTREGISTERED

let battleMap = {}

// Load old cache on init
try {
  battleMap = JSON.parse(fs.readFileSync(_cacheFile))
} catch (error) {
  log(`if ENOENT this is totally ok - could not load JSON from old cache: ${error}`)
}

// Simple persistence layer
function _saveBattleState(){
  try {
    fs.writeFileSync(_cacheFile, JSON.stringify(battleMap, null, 2))
  } catch(error) {
    log(`error saving cache: ${error}`)
  }
}

// Utility for clearing out battle registrations at the end of a battle
function _resetBattleRegistration(battleName) {
  if (!VOTEREGKEY in battleMap) {
    battleMap[VOTEREGKEY] = {}
  }
  let voteRegistry = battleMap[VOTEREGKEY]
  for (let entrant in voteRegistry) {
    if (voteRegistry[entrant] == battleName) {
      delete voteRegistry[entrant]
    }
  }
}

// Battle data reset and core "structure" setup
function _resetBattleState(battleName) {
  //TODO mv disk cache to cache.backup
  let battleExisted = _isBattleInProgress(battleName)
  // Super simple template
  battleMap[battleName] = {
    ENTRYKEY: {},
    VOTEKEY: {},
    SUB_DL_KEY: false,
    VOTE_DL_KEY: false
  }
  _saveBattleState()
  if (!battleExisted) {
    return `looks like the first battle in this channel, lets goooo!`
  } else {
    return `the old battle is OVER, a new round has started!`
  }
}
exports.newBattle = _resetBattleState

// Stop battles for an active battle channel
function _deactivateBattle(battleName) {
  if (battleName in battleMap) {
    log(`deactivating ${battleName}`)
    delete battleMap[battleName]
    _saveBattleState()
    return `this battle has been deactivated, !newbattle to reactivate`
  }
  return `battle is already deactivated, !newbattle to get this party started :sparkle:`
}
exports.deactivateBattle = _deactivateBattle

// Fast way to check "is this channel battle-ready"
function _isBattleChannel(battleName) {
  return battleName in battleMap
}
exports.isBattleChannel = _isBattleChannel

// Trick for using this function locally and as export
function _battleSize(battleName) {
  if (_isBattleChannel(battleName)) {
    return Object.keys(battleMap[battleName][ENTRYKEY]).length
  }
  return 0
}
exports.getBattleSize = _battleSize

// Quick util for seeing if a battle is active
function _isBattleInProgress(battleName) {
  log(`checking progress for ${battleName}`)
  if (!_isBattleChannel(battleName)) {
    return false
  }
  let battleHasEntries = _battleSize(battleName) > 0
  log(`btl entries: ${battleHasEntries}`)
  return battleHasEntries
}
exports.isBattleActive = _isBattleInProgress

exports.setSubDeadline = function(battleName, dayJsDate){
  battleMap[battleName][SUB_DL_KEY] = dayJsDate.toISOString()
  _saveBattleState()
}

exports.setVotingDeadline = function(battleName, dayJsDate){
  battleMap[battleName][VOTE_DL_KEY] = dayJsDate.toISOString()
  _saveBattleState()
}

// Look... I know it's ugly, but DRY + needing to use exported functions
//   locally means this nonsense
function _getDeadlineByName(battleName, dlname){
  const dl = battleMap[battleName][dlname]
  if (dl) {
    return new day.dayjs(dl)
  }
  return null
}
var _getSubDeadline = (battlename) => _getDeadlineByName(battlename, SUB_DL_KEY)
var _getVoteDeadline = (battlename) => _getDeadlineByName(battlename, VOTE_DL_KEY)
exports.getSubDeadline = _getSubDeadline
exports.getVotingDeadline = _getVoteDeadline

function _isSubmitOpen(battleName) {
  const now = new day.dayjs()
  const subdl = _getSubDeadline(battleName)
  if (subdl)
    return now.isBefore(subdl)
  return true // No deadline in a battle means its open until closed
  // return !subdl || now.isBefore(subdl)
}
exports.isSubmitOpen = _isSubmitOpen

function _isVotingOpen(battleName){
  const now = new day.dayjs()
  const vdl = _getVoteDeadline(battleName)
  if (vdl)
    return now.isBefore(vdl)
  return true // Same reason as _isSubmitOpen, no reason to block it
}
exports.isVotingOpen = _isVotingOpen

exports.addEntry = function(entrantId, entrantName, link, battleName){
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

exports.getEntriesFor = function(battleName){
  return battleMap[battleName][ENTRYKEY]
}

function _getBattleIDbyVoter(userID){
  if (!VOTEREGKEY in battleMap){
    battleMap[VOTEREGKEY] = {} // JIT assumption management
  }
  return battleMap[VOTEREGKEY][userID] || USERNOTREGISTERED
}
exports.getBattleIDbyVoter = _getBattleIDbyVoter
exports.isVoterRegistered = (userid) => _getBattleIDbyVoter(userid) != USERNOTREGISTERED

exports.registerVoter = function(userID, battleName){
  if (!VOTEREGKEY in battleMap) {
    battleMap[VOTEREGKEY] = {} // JIT assumption management
  }
  // mapping by userID like this avoids dual-registration
  battleMap[VOTEREGKEY][userID] = battleName
  _saveBattleState()
}

exports.voteAndDeregister = function(userID, voteIdxArray){
  const battleName = getBattleIDbyVoter(userID)
  if (battleName == USERNOTREGISTERED) {
    return USERNOTREGISTERED
  }
  battleMap[battleName][VOTEKEY][userID] = voteIdxArray
  // Revoking vote registration tag
  delete battleMap[VOTEREGKEY][userID]
  _saveBattleState()
  return `your vote has been cast for entries ${voteIdxArray} listed above!\nRun \`!getballot\` in a battle channel if you want to change your vote or vote in a new battle!` 
}

exports.getPodium = function(battleName, entrantCap = 10){
  //TODO
}
