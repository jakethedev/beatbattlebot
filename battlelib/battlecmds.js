const { Message } = require('discord.js')
const bcache = require('./battlecache')

let debug = msg => console.log(`battlecmds: ${msg}`)

//TODO Persist this similar to battleCache
let closedBattles = []

exports.newbattle = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Usage: \`!newbattle\` to start a new beat battle for this channel!`
  }
  if (msg.guild){
    // Taking a swing at permission locking this command
    if (msg.member.permissions.any(['ADMINISTRATOR', 'MANAGE_CHANNELS'])){
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

exports.submit = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Usage: \`!submit https://link.to.your/beat\` to enter the battle in this channel (if a battle is active)` 
  }
  if (msg.guild) {
    let requestorName = msg.member.user.username
    let battleName = `${msg.guild.name}_${msg.channel.name}`
    if (!input.includes('https')) {
      return `this doesn't look like a valid link, make sure it's an *https* address then try again!`
    }
    debug(`${requestorName} has submitted ${input.trim()} for battle[${battleName}]`)
    return bcache.addEntry(requestorName, input.trim(), battleName)
  } else {
    return `this command needs to be run in a server`
  }
}

exports.submissions = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `\`!submissions\` to print out all submissions for this channel's beat battle, if any exist`
  }
  if (msg.guild) {
    let battleName = `${msg.guild.name}_${msg.channel.name}`
    if (bcache.isBattleActive(battleName)){
      const submissionMap = bcache.getRawEntryMapForBattle(battleName)
      let response = `here are the submissions for this channel's battle:\n`
      submissionMap.forEach((v,k) => {
        response += `${k} -> ${v}\n`
      })
      return response
    } else {
      return `there isn't a battle happening in this channel - ask a mod to start one!`
    }
  } else {
    return `this command needs to be run in a server`
  }
}
/*
exports.stopsubs = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: TODO usage info`
  }
  if (msg.guild) {
    let battleName = `${msg.guild.name}_${msg.channel.name}`
    return bcache.getCacheForBattle(battleName)
  } else {
    return `this command needs to be run in a server`
  }
}

exports.battlevote = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: TODO usage info`
  }
  if (msg.guild) {
    let battleName = `${msg.guild.name}_${msg.channel.name}`
    return `here's a form with all entrants and emojis to vote on them with`
  } else {
    return `this command needs to be run in a server`
  }
}
*/