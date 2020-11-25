const { Message } = require('discord.js')
const bcache = require('./battlecache')

let debug = msg => console.log(`battlecmds: ${msg}`)

//TODO Persist this similar to battleCache?
let closedBattles = []

// Relies on discord permission scheme: https://discord.com/developers/docs/topics/permissions
function _isPowerfulMember(msg){
  const isAdmin = msg.member.permissions.any(['ADMINISTRATOR', 'MANAGE_CHANNELS'])
  //TODO: const hasBotRole = msg.member.roles.any()
  return isAdmin // || hasBotRole
    
}

exports.newbattle = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Post \`!newbattle\` to start a new beat battle for this channel!`
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

exports.submit = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Post a new message that starts with \`!submit https://link.to.your/beat\` to enter the battle in this channel!` 
  }
  if (msg.guild) {
    let requestorName = msg.member.user.username
    let battleName = `${msg.guild.name}_${msg.channel.name}`
    const entry = input.split(' ')[0].trim()
    if (!entry.includes('https')) {
      return `the first word after submit doesn't look like a valid link, make sure it's an *https* address then try again!`
    }
    debug(`${requestorName} has submitted ${entry} for battle[${battleName}]`)
    return bcache.addEntry(requestorName, entry, battleName)
  } else {
    return `this command needs to be run in a server`
  }
}

exports.submissions = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    //TODO Update with 'here' param
    return `Post \`!submissions\` to see all submissions for this channel's beat battle, I'll DM you the list if it's a big one! \`!submissions here\` to override and print the list to this channel even if it's massive`
  }
  if (msg.guild) {
    let battleName = `${msg.guild.name}_${msg.channel.name}`
    if (bcache.isBattleActive(battleName)){
      const submissionMapObj = bcache.getSubsFor(battleName)
      // First gnarly hack of the bot: battle entry lists break the 2000 character limit pretty easily, so 
      // this is a cheap way to paginate the response, bot.js knows to msg.reply the first entry of an array
      // and the rest are just sent to the channel the command was received in
      let response = [`here are the current submissions:\n`]
      let curIdx = 0
      for (const [key, value] of Object.entries(submissionMapObj)) { // { key=user: value=link }
        let miniBuffer = ` - ${key} -> <${value}>\n`
        if (response[curIdx].length + miniBuffer.length >= 1600){
          curIdx++
          response[curIdx] = '' // *ding* typewriter sounds
        }
        response[curIdx] += miniBuffer
      }
      response[curIdx+1] = "Be careful, there's a lot of heat in this list :fire:"
      // If we've got a small battle or someone says "here", print to the channel
      let largeBattle = Object.entries(submissionMapObj).length > 10
      let printInChannel = !largeBattle || input.toLowerCase() == 'here'
      if (printInChannel) {
        return response
      }
      // At this point we have a big battle, reply via dm with a confirmation to channel
      msg.author.send(response[0])
      response.shift()
      for (const otherItem of response){
        msg.author.send(otherItem)
      }
      return `sent you the list!`
    } else {
      return `there are no entries, or there isn't an active battle in this channel`
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
    if (_isPowerfulMember(msg)){
      let battleName = `${msg.guild.name}_${msg.channel.name}`
      return bcache.getCacheForBattle(battleName)
    } else {
      return `you have no power here - consult a mod :slight_smile:`
    }
  } else {
    return `this command needs to be run in a server`
  }
}
*/

/*
exports.battlevote = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: TODO usage info`
  }
  if (msg.guild) {
    let battleName = `${msg.guild.name}_${msg.channel.name}`
    const submissionMap = bcache.getRawEntryMapForBattle(battleName)
    let response = `here are the submissions for this channel's battle:\n`
    submissionMap.forEach((v,k) => {
      response += `-- ${k} -> ${v}\n`
    })
    return `here's a form with all entrants and emojis to vote on them with`
  } else {
    return `this command needs to be run in a server`
  }
}
*/