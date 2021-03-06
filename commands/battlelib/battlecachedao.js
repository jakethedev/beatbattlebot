const MSG_INACTIVE_BATTLE = `there is no active battle in this channel, consult a mod if this is unexpected`

const fs = require('fs')
const _cacheFile = 'battlecache.json'
const debug = msg => console.log(`bcache: ${msg}`)

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

function _deregisterVoter(battleName, userID){
  //TODO
}

// Trick for using this function locally and as export
exports.getBattleSize = _battleSize

exports.isBattleActive = function(battleName){
  debug(`checking progress for ${battleName}`)
  return _isBattleInProgress(battleName)
}

exports.isSubmitOpen = function(battleName){
  //TODO
}

exports.isVotingOpen = function(battleName){
  //TODO
}

exports.setSubDeadline = function(battleName, timeFromNow){
  //TODO
}

exports.setVotingDeadline = function(battleName, timeFromNow){
  //TODO
}

exports.getSubDeadline = function(battleName){
  //TODO
}

exports.getVotingDeadline = function(battleName){
  //TODO
}

exports.addEntry = function(entrantId, entrantName, link, battleName){
  if (!battleMap[battleName]){
    return `there is no active battle for this channel`
  }
  //TODO if subdeadline passed: return 'the deadline passed
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

exports.registerVoter = function(battleName, userID){
  //TODO
}

exports.voteAndDeregister = function(battleName, userID, voteIdxArray){
  //TODO
}


exports.getPodium = function(battleName, entrantCap = 10){
  //TODO
}
