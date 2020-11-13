const { Message } = require('discord.js')
const musiclib = require('./musiclib')

let debug = msg => console.log(`musiccmds: ${msg}`)

// Relies on discord permission scheme: https://discord.com/developers/docs/topics/permissions
function _isPowerfulMember(msg){
  return msg.member.permissions.any(['ADMINISTRATOR', 'MANAGE_CHANNELS'])
}

exports.newbattle = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Usage: \`!newbattle\` to start a new beat battle for this channel!`
  }
  if (msg.guild){
    if (_isPowerfulMember(msg)){
      let battleName = `${msg.guild.name}_${msg.channel.name}`
      if (bcache.isBattleActive(battleName) && input !== 'letsgo') {
        return `heads up, this resets the current battle. Are you ready for a new round? \`!newbattle letsgo\` to confirm!`
      }
      return bcache.resetCache(battleName)
    } else {
      return `you have no power here - consult a mod :slight_smile:`
    }
  } else {
    return `this command needs to be run in a server`
  }
}
