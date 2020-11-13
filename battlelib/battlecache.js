const fs = require('fs')
const _cacheFile = 'battlecache.json'
let debug = msg => console.log(`bcache: ${msg}`)

// Load old cache on init
let battleMap = {}
try {
  //TODO This is broken as hell, this needs to parse right or move to raw Objects to work
  battleMap = fs.readFileSync(_cacheFile).toJSON()
} catch (error) {
  debug(`if ENOENT this is totally ok - could not load JSON from old cache: ${error}`)
  battleMap = {}
}

// Simple persistence layer
function _saveBattleState(){
  try {
    fs.writeFileSync(_cacheFile, JSON.stringify(battleMap))
  } catch(error) {
    debug(`error saving cache: ${error}`)
  }
}

// Quick util for seeing if a battle is active
function _isBattleInProgress(battleName){
  let battleExists = !!battleMap[battleName]
  debug(`btl exists: ${battleExists}`)
  let battleHasEntries = battleExists && battleMap[battleName].size > 0
  debug(`btl entries: ${battleHasEntries}`)
  return battleHasEntries
}

exports.addEntry = function(username, link, battleName){
  if (!battleMap[battleName]){
    return `there is no active battle for this channel`
  }
  let entryExisted = battleMap[battleName].get(username) // For smarter output
  battleMap[battleName].set(username, link);
  _saveBattleState()
  if (entryExisted){
    return `thanks for the update, saved your new entry! (${battleMap[battleName].size} entries)`
  } else {
    return `welcome to the battle! (${battleMap[battleName].size} entries)`
  }
}

exports.resetCache = function(battleName){
  //TODO mv disk cache to cache.back
  let battleExisted = _isBattleInProgress(battleName)
  battleMap[battleName] = new Map()
  _saveBattleState()
  if (!battleExisted) {
    return `looks like the first battle in this channel, lets goooo!`
  } else {
    return `the old battle is OVER, a new round has started!`
  }
}

exports.getRawEntryMapForBattle = function(battleName){
  if (!battleMap[battleName]){
    debug(`get: new subcache for ${battleName}`)
    battleMap[battleName] = new Map()
  } 
  return battleMap[battleName]
}

exports.getBattleSize = function(battleName){
  if (!battleMap[battleName]){
    return `this battle does not exist`
  }
  return battleMap[battleName].size()
}

exports.isBattleActive = function(battleName){
  debug(`checking progress for ${battleName}`)
  return _isBattleInProgress(battleName)
}