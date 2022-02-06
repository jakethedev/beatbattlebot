const fs = require('fs')
const day = require('./dayjs')
const _cacheFile = 'servercache.json'
const log = msg => console.log(`serverdao: ${msg}`)

let serverData = {}

// Load old server data on import
try {
  serverData = JSON.parse(fs.readFileSync(_cacheFile))
} catch (error) {
  log(`if ENOENT this is totally ok - could not load JSON from old cache: ${error}`)
}

// Simple persistence layer
function _saveServerData(){
  try {
    fs.writeFileSync(_cacheFile, JSON.stringify(serverData, null, 2))
  } catch(error) {
    log(`error saving server data: ${error}`)
  }
}

exports.listenToChannel = function(discChannel) {
  //TODO save channel
  //TODO call save
}

exports.ignoreChannel = function(discChannel) {
  //TODO unsave channel
  //TODO call save
}

exports.getChannels = function(serverid) {
  //TODO return feedbackdao.getChannels + battledao.getChannels? yikes?
  // TODO: maybe just all channels are valid, rely on mods not to open everything to everyone
}

exports.addBotModRole = function(serverid, discordJsRole) {
  //TODO add, save, and be good
  //TODO call save
}

exports.removeBotModRole = function(serverid, discordJsRole) {
  //TODO remove and be happy
  //TODO call save
}

exports.getBotModRoles = function(serverid) {
  //TODO return all mod-roles in serverid
}

exports.addWinner = function(serverid, channelid, userid) {
  // TODO add a new champion
  //TODO call save
}

exports.getWinners = function(serverid, channelid) {
  // TODO if serverid, get server winners. if channelid, get channel winners?
}

exports.setPreferredTimezone = function(serverid, tztext) {
  // TODO verify tztext parses and makes sense
  //TODO call save
}

exports.getPreferredTimezone = function(serverid) {
  // TODO if get never called, set to EST
}