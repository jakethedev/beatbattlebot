const { Message } = require('discord.js')
const discordutil = require('../../util/discord')
const battledao = require('./battlecachedao')

const MSG_SERVER_ONLY = "this command needs to be run in a server channel where this bot is active"
const MSG_MOD_ONLY = "this is a mod-only command"
const MSG_BATTLE_INACTIVE = "there is no active battle for this channel, ask a mod if that's a surprise"

let debug = msg => console.log(`battlecmds: ${msg}`)

exports.newbattle = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Post \`!newbattle\` to start a new beat battle for this channel!`
  }
  if (msg.guild){
    if (discordutil.isPowerfulMember(msg)){
      let battleName = `${msg.guild.name}_${msg.channel.name}`
      if (battledao.isBattleActive(battleName) && input !== 'letsgo') {
        return `heads up, this resets the current battle. Are you ready for a new round? \`!newbattle letsgo\` to confirm!`
      }
      return battledao.resetCache(battleName)
    } else {
      return MSG_MOD_ONLY
    }
  } else {
    return MSG_SERVER_ONLY
  }
}

exports.submit = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Post a new message that starts with \`!submit https://link.to.your/beat\` to enter the battle in this channel!` 
  }
  if (msg.guild) {
    let entrantId = msg.member.id
    //TODO Figure out why this doesn't seem to update on nick change? link 
    let entrantName = msg.member.nickname || msg.member.user.username
    let battleName = `${msg.guild.name}_${msg.channel.name}`
    const link = input.split(' ')[0].trim()
    if (!link.includes('https')) {
      return `the first word after submit doesn't look like a valid link, make sure it's an *https* address then try again!`
    }
    debug(`${entrantName} has submitted ${link} for battle[${battleName}]`)
    return battledao.addEntry(entrantId, entrantName, link, battleName)
  } else {
    return MSG_SERVER_ONLY
  }
}

exports.submissions = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    //TODO Update with 'here' param
    return `Post \`!submissions\` to see all submissions for this channel's beat battle, I'll DM you the list if it's a big one! \`!submissions here\` to override and print the list to this channel even if it's massive`
  }
  if (msg.guild) {
    let battleName = `${msg.guild.name}_${msg.channel.name}`
    if (battledao.isBattleActive(battleName)){
      const submissionMapObj = battledao.getEntriesFor(battleName)
      // First gnarly hack of the bot: battle entry lists break the 2000 character limit pretty easily, so 
      // this is a cheap way to paginate the response, bot.js knows to msg.reply the first entry of an array
      // and the rest are just sent to the channel the command was received in
      let response = [`here are the current submissions:\n`]
      let curIdx = 0
      // TODO dao should unpack this somehow
      for (const [id, entry] of Object.entries(submissionMapObj)) { // { key=user: value=link }
        const { link, displayname } = entry
        let miniBuffer = ` - ${displayname} -> <${link}>\n`
        if (response[curIdx].length + miniBuffer.length >= 1600){
          curIdx++
          response[curIdx] = '' // *ding* typewriter sounds
        }
        response[curIdx] += miniBuffer
      }
      response[curIdx+1] = "Be careful, there's a lot of heat in this list :fire:"
      debug(`pages of response: ${curIdx}`)
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
      return MSG_BATTLE_INACTIVE
    }
  } else {
    return MSG_SERVER_ONLY
  }
}

exports.deadlines = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: #TODO usage info`
  }
  if (msg.guild) {
    if (discordutil.isPowerfulMember(msg)){
      let battleName = `${msg.guild.name}_${msg.channel.name}`
      //return bcache.getCacheForBattle(battleName)
      return `not implemented yet`
    } else {
      return MSG_MOD_ONLY
    }
  } else {
    return MSG_SERVER_ONLY
  }
}

exports.stopsubs = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: #TODO usage info`
  }
  if (msg.guild) {
    if (discordutil.isPowerfulMember(msg)){
      let battleName = `${msg.guild.name}_${msg.channel.name}`
      return `not implemented yet`
    } else {
      return MSG_MOD_ONLY
    }
  } else {
    return MSG_SERVER_ONLY
  }
}

exports.stopvotes = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: #TODO usage info`
  }
  if (msg.guild) {
    if (discordutil.isPowerfulMember(msg)){
      let battleName = `${msg.guild.name}_${msg.channel.name}`
      return `not implemented yet`
    } else {
      return MSG_MOD_ONLY
    }
  } else {
    return MSG_SERVER_ONLY
  }
}

exports.getballot = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: #TODO usage info`
  }
  if (msg.guild) {
    let battleName = `${msg.guild.name}_${msg.channel.name}`
    const submissionMap = bcache.getRawEntryMapForBattle(battleName)
    let response = `here are the submissions for this channel's battle:\n`
    submissionMap.forEach((v,k) => {
      response += `-- ${k} -> ${v}\n`
    })
    return `not implemented yet`
  } else {
    return MSG_SERVER_ONLY
  }
}

exports.vote = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: #TODO usage info`
  }
  if (msg.guild) {
    let battleName = `${msg.guild.name}_${msg.channel.name}`
    const submissionMap = bcache.getRawEntryMapForBattle(battleName)
    let response = `here are the submissions for this channel's battle:\n`
    submissionMap.forEach((v,k) => {
      response += `-- ${k} -> ${v}\n`
    })
    return `not implemented yet`
  } else {
    return MSG_SERVER_ONLY
  }
}

exports.results = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: #TODO usage info`
  }
  if (msg.guild) {
    if (discordutil.isPowerfulMember(msg)){
      let battleName = `${msg.guild.name}_${msg.channel.name}`
      return `not implemented yet`
    } else {
      return MSG_MOD_ONLY
    }
  } else {
    return MSG_SERVER_ONLY
  }
}