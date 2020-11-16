const { Message } = require('discord.js')
const musiclib = require('./musiclib')

let debug = msg => console.log(`musiccmds: ${msg}`)

// Relies on discord permission scheme: https://discord.com/developers/docs/topics/permissions
function _isPowerfulMember(msg){
  return msg.member.permissions.any(['ADMINISTRATOR', 'MANAGE_CHANNELS'])
}

exports.genrespin = function(input, msg) {
  return `this is still under construction, check back later`
}

exports.moodspin = function(input, msg) {
  return `this is still under construction, check back later`
}
