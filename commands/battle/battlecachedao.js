const fs = require('fs')
const constants = require('../../util/constants')
const day = require('../../util/dayjs')
const _cacheFile = 'battlecache.json'
const log = msg => console.log(`battledao: ${msg}`)

// These are basically table names
const ENTRYKEY = "entries"
const VOTECACHEKEY = "votes"
const VOTEREGKEY = "votereg"
const SUB_DL_KEY = "subdeadline"
const VOTE_DL_KEY = "votedeadline"

// Barebones default state
let battleMap = {}

// Load old cache on init
try {
  battleMap = JSON.parse(fs.readFileSync(_cacheFile))
} catch (error) {
  log(`if ENOENT this is expected - could not load battle data from old cache: ${error}`)
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
function _resetBattleState(battleName) {
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
  //TODO: change this to serverdao.getBattles().includes(battlename)
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
// returns tuned dayjs object
exports.getSubDeadline = _getSubDeadline
// returns tuned dayjs object
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

exports.removeEntry = function(entrantId, battleName) {
  let entryExisted = !!battleMap[battleName][ENTRYKEY][entrantId] // For smarter output
  if (entryExisted) {
    delete(battleMap[battleName][ENTRYKEY][entrantId])
    _saveBattleState()
    return `your entry has been removed, hope to see you again soon!`
  }
  return `you don't have an active entry in this battle`
}

exports.getEntriesFor = function(battleName) {
  return battleMap[battleName][ENTRYKEY]
}

exports.getVoteCountForBattle = function(battleName) {
  const battleData = battleMap[battleName]
  const entryMap = battleData[ENTRYKEY]
  const votes = battleData[VOTECACHEKEY]
  // Set up a way to store counters
  let voteCounter = {}
  for (let i = 1; i <= _battleSize(battleName); i++ ) {
    voteCounter[`${i}`] = 0
  }
  // Count all the votes, find the top X, return ordered list of votes
  for (let voterID in votes) {
    for (let vote of votes[voterID]) {
      voteCounter[`${vote}`]++
    }
  }
  return voteCounter
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

//TODO getter AND SETTER for both of these
exports.getPodiumSize = function(battleName){
  return constants.BATTLE_DEFAULT_RESULTS
}
let setPodiumSize = function(battleName) {
  //TODO get this right
  debug("THIS IS NOT READY OMG")
}

exports.getBallotSize = function(battleName) {
  //TODO get this right
  return constants.BATTLE_DEFAULT_VOTEMAX
}
let setBallotSize = function(battleName) {
  //TODO get this right
  debug("THIS IS NOT READY OMG")
}

// TODO: finish implementing for #72
_validTiebreakOptions = ['random', 'oldest'] //, 'weighted']
exports.setTiebreak = function(serverid, input) {
  //TODO validate input as
  //TODO call save
}

exports.getTiebreak = function(serverid) {
  //TODO return a valid tiebreak option set for server
  //    JIT save a default tiebreak upon first get, save file
}

exports.getTiebreakOptions = () => _validTiebreakOptions
