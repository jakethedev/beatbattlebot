const MSG_INACTIVE_BATTLE = `there is no active battle in this channel, consult a mod if this is unexpected`

const fs = require('fs')
const day = require('../../util/dayjs')
const _cacheFile = 'battlecache.json'
const debug = msg => console.log(`bcache: ${msg}`)

const VOTEREGKEY = "votereg"

// Constant for use as a return code on getBattleIDbyVoter, see usages in battlecontroller
const USERNOTREGISTERED = "nobodyhome"
exports.USERNOTREGISTERED = USERNOTREGISTERED

let battleMap = {}

// Load old cache on init
try {
  battleMap = JSON.parse(fs.readFileSync(_cacheFile))
} catch (error) {
  debug(`if ENOENT this is totally ok - could not load JSON from old cache: ${error}`)
  battleMap = {}
}

// Simple persistence layer
function _saveBattleState(){
  try {
    fs.writeFileSync(_cacheFile, JSON.stringify(battleMap, null, 2))
  } catch(error) {
    debug(`error saving cache: ${error}`)
  }
}

// Just for readability below
function _battleSize(battleName){
  if (battleMap[battleName])
    return Object.keys(battleMap[battleName].entries).length
  return 0
}

// Quick util for seeing if a battle is active
function _isBattleInProgress(battleName){
  let battleExists = !!battleMap[battleName]
  debug(`btl exists: ${battleExists}`)
  let battleHasEntries = battleExists && _battleSize(battleName) > 0
  debug(`btl entries: ${battleHasEntries}`)
  return battleHasEntries
}

function _deregisterVoter(userID){
  delete battleMap[VOTEREGKEY][userID]
}

// Trick for using this function locally and as export
exports.getBattleSize = _battleSize

exports.isBattleActive = function(battleName){
  debug(`checking progress for ${battleName}`)
  return _isBattleInProgress(battleName)
}

function _isSubmitOpen(battleName) {
  const now = new day.dayjs()
  const subdl = battleMap[battleName]['subdeadline']
  if (subdl)
    return now.isBefore(subdl)
  return true // No deadline in a battle means its open until closed
}
exports.isSubmitOpen = _isSubmitOpen

function _isVotingOpen(battleName){
  const now = new day.dayjs()
  const vdl = battleMap[battleName]['votedeadline']
  if (vdl)
    return now.isBefore(vdl)
  return true // Same reason as _isSubmitOpen, no reason to block it
}
exports.isVotingOpen = _isVotingOpen

exports.setSubDeadline = function(battleName, dayJsDate){
  battleMap[battleName]['subdeadline'] = dayJsDate.toISOString()
  _saveBattleState()
}

exports.setVotingDeadline = function(battleName, dayJsDate){
  battleMap[battleName]['votedeadline'] = dayJsDate.toISOString()
  _saveBattleState()
}

exports.getSubDeadline = function(battleName){
  const subdl = battleMap[battleName]['subdeadline']
  if (subdl)
    return new day.dayjs(subdl)
  return null // Simplest effective solution for now
}

exports.getVotingDeadline = function(battleName){
  const vdl = battleMap[battleName]['votedeadline']
  if (vdl)
    return new day.dayjs(vdl)
  return null // Simplest effective solution for now
}

exports.addEntry = function(entrantId, entrantName, link, battleName){
  // Expects caller to verify that submissions are allowed
  if (!battleMap[battleName]){
    return `there is no active battle for this channel`
  }
  let entryExisted = !!battleMap[battleName].entries[entrantId] // For smarter output
  battleMap[battleName].entries[entrantId] = {
    'ts': new Date(),
    'link': link,
    'displayname': entrantName
  };
  _saveBattleState()
  let numEntries = _battleSize(battleName)
  if (entryExisted){
    return `thanks for the update, saved your new entry! (${numEntries} entries)`
  } else {
    return `welcome to the battle! (${numEntries} entries)`
  }
}

exports.resetCache = function(battleName){
  //TODO mv disk cache to cache.backup
  let battleExisted = _isBattleInProgress(battleName)
  // Super simple template
  battleMap[battleName] = { 'entries': {}, 'votes': {}, 'subdeadline': false, 'votedeadline': false }
  _saveBattleState()
  if (!battleExisted) {
    return `looks like the first battle in this channel, lets goooo!`
  } else {
    return `the old battle is OVER, a new round has started!`
  }
}

exports.getEntriesFor = function(battleName){
  if (!battleMap[battleName]){
    return `there's no active battle in this channel, ask a mod if there should be one`
  } 
  return battleMap[battleName].entries
}

function getBattleIDbyVoter(userID){
  return battleMap[VOTEREGKEY][userID] || USERNOTREGISTERED
}
exports.getBattleIDbyVoter = getBattleIDbyVoter

exports.registerVoter = function(userID, battleName){
  battleMap[VOTEREGKEY][userID] = battleName
}

exports.voteAndDeregister = function(userID, voteIdxArray){
  const battleName = getBattleIDbyVoter(userID)
  if (battleName == USERNOTREGISTERED) {
    return USERNOTREGISTERED
  }
  battleMap[battleName]["votes"][userID] = voteIdxArray
  _deregisterVoter(userID)
  return `your vote has been cast for entries ${voteIdxArray} listed above!\nRun \`!getballot\` in a battle channel if you want to change your vote or vote in a new battle!` 
}

exports.getPodium = function(battleName, entrantCap = 10){
  //TODO
}
