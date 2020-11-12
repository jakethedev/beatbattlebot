const fs = require('fs')
const _cacheFile = 'battlecache.json'
//TODO This needs to work for multiple serverNames from the start
//TODO initialize code, read from _cacheFile if exists, put data in _entriesMap
let battleMap = {}

let debug = msg => console.log(`bcache: ${msg}`)

exports.addEntry = function(username, link, serverName){
  if (!battleMap[serverName]){
    debug(`add: new subcache for ${serverName}`)
    battleMap[serverName] = new Map() 
  }
  let entryExisted = battleMap[serverName].get(username) // For smarter output
  battleMap[serverName].set(username, link);
  //TODO use fs.writeSync method since we're already async
  if (entryExisted){
    return `thanks for the update, saved your new entry! (${battleMap[serverName].size} entries)`
  } else {
    return `welcome to the battle! (${battleMap[serverName].size} entries)`
  }
}

exports.emptyCache = function(serverName){
  //TODO mv disk cache to cache.back
  battleMap[serverName] = new Map()
  return `a new battle has begun!`
  //TODO save modified battlemap to disk
}

exports.getCacheForServer = function(serverName){
  if (!battleMap[serverName]){
    debug(`get: new subcache for ${serverName}`)
    battleMap[serverName] = new Map()
  } 
  return battleMap[serverName]
}

exports.stopSubsForServer = function(serverName){
  debug(`stop: TODO figure out way to cleanly stop entries for ${serverName}`)
  return `this is not implemented yet`
}
