const { Message } = require('discord.js')
const constants = require('../../util/constants')
const discordutil = require('../../util/discord')
const serverdao = require('../../util/serverdao')
const showcasedao = require('../../database/showcasedao')
const day = require('../../util/dayjs')
const rand = require('../../util/random')

let debug = msg => console.log(`showcasectl: ${msg}`)

function _submitLink (userid, channelid, link) {
  // TODO: make safe before or after notes
  //    also return output should be note-presence sensitive
  return 'showcase submissions disabled at the moment, stay tuned!'
}

function _submitNotes (userid, channelid, notes) {
  // TODO: make safe before or after link
  //    also return output should be link-presence sensitive
  return 'showcase submissions disabled at the moment, stay tuned!'
}

function _getShowcaseEntries(max = false) {
  if (max) console.log(`returning max ${max} entries`)
  // const showcaseOrder = serverdao.getFeedbackOrder(serverid)
  // TODO: get weighted list, pick one
  return `this is a showcase entry, user not staged, TBD`
}

function _openChannelForShowcase(channelid) {
  // TODO: default "showcase" data struct setup
  return `channel ${channelid} is TBD OPEN for showcase`
}

function _closeChannelForShowcase(channelid) {
  return `channel ${channelid} is TBD CLOSED for showcase`
}

function _resetShowcaseChannel(channelid) {
  return `showcase for channel ${channelid} has not been reset TBD`
}

function _setShowcaseOrder(channelid, orderinput) {
  return `showcase order has TBD been set to ${orderinput}`
}

function _getShowcaseOrder(channelid) {
  // const scorder = showcasedao.get
  return `sc order got and we got ${orderinput}`
}

exports.sc = function(input = '', msg) {
  input = `${input}` // typescript.js
  const userid = msg.author.id
  const channelid = msg.guild ? msg.channel.id : false
  const serverid = msg.guild ? msg.guild.id : false
  debug(`sc running in channel? ${channelid} on server? ${serverid}`)
  let response = `Usage: run !guide to see the full rundown of showcase commands`

  // OK look I know this SEEMS horrific but each if is a routine for specific input,
  //  choices where this or have a command for each operation. I'm fine
  //  with that but we have a UX to perfect here, and !fb link is sick
  if (input.startsWith('https://')) { // link indicates a submission and optional notes
    //TODO: move to subroutine
    let [link, ...notes] = input.split(/\s/)
    if (notes && notes.length > 0) {
      _submitNotes(userid, notes.join(' '))
    }
    return _submitLink(userid, link.trim())
  } else if (input == 'notes') { // save notes from entrant for showcase
    // TODO: safe to do before or after entry
    return _submitNotes(userid, input)
  } else if (input == 'open') { // open the channel to submissions
    if (discordutil.isMessageFromMod(msg)) {
      return _openChannelForShowcase()
    }
    return constants.MSG_MOD_ONLY
  } else if (input == 'close') { // stop the channel from accepting submissions
    if (discordutil.isMessageFromMod(msg)) {
      return _closeChannelForShowcase(channelid)
    }
    return constants.MSG_MOD_ONLY
  } else if (input == 'go') { // MODONLY: stage a user for showcase
    return _getShowcaseEntries(channelid)
  } else if (input.startsWith('reset')) { // MODONLY: wipe the channel's fb queue and cooldowns
    if (discordutil.isMessageFromMod(msg)) {
      if (input.includes('letsgo')) {
        return _resetshowcaseChannel(channelid)
      }
      return "warning, this wipes out this channel's showcase queue, are you sure? run `!sc reset letsgo` to confirm"
    }
    return constants.MSG_MOD_ONLY
  }
  debug('default showcase case return help')
  return 'showtime'
}

//exports.
submit = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Usage: Post a new message that starts with \`!submit https://link.to.your/beat\` to enter the battle in this channel! Make sure there's a space after your link if you want to write more in your message, otherwise it might not save right`
  }
  if (msg.guild) {
    const battleName = `${msg.channel.id}`
    if (!battledao.isBattleChannel(battleName)){
      return MSG_BATTLE_INACTIVE
    }
    // Note: nickname changes take time to propagate, so nickchange -> submit can result in the old nick saving instead
    let entrantId = msg.member.id
    let entrantName = msg.member.nickname || msg.member.user.username
    const link = input.split(' ')[0].trim()
    debug(`${entrantName} has submitted ${link} for battle[${battleName}]`)
    if (!battledao.isSubmitOpen(battleName)){
      const subdl = battledao.getSubDeadline(battleName)
      return `sorry but this battle is closed, the submission deadline was ${day.fmtAsPST(subdl)}`
    }
    if (!link.includes('https')) {
      return `the first word after submit doesn't look like a valid link, make sure it's an *https* address then try again!`
    }
    return battledao.addEntry(entrantId, entrantName, link, battleName)
  } else {
    return constants.MSG_SERVER_ONLY
  }
}

//exports.
fbget = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Post \`!submissions\` to see this battle's entries! Use \`!submissions here\` to print entries to this channel (no matter how big the list is)`
  }
  // DEFAULT 1 submission by DM, user is then set to cooldown
  //   OR: last userid pulled is cached per channel, and !fbchill places them on cooldown
  //   THAT WAY ITS OPTIONAL AND WE CAN POLL WITHOUT REMOVING AN ENTRY
  if (msg.guild) {
    const battleName = `${msg.channel.id}`
    if (!battledao.isBattleChannel(battleName)){
      return MSG_BATTLE_INACTIVE
    }
    if (battledao.isBattleActive(battleName)){
      let submissionMapObj = battledao.getEntriesFor(battleName)
      const shuffled = input.includes('shuf')
      const printInChannel = input.includes('here')
      if (shuffled) {
        submissionMapObj = rand.getShuffledCopyOfObject(submissionMapObj)
      }
      const response = discordutil.formatSubmissionsToArray(submissionMapObj, shuffled)
      // If we've got a small battle or someone says "here", print to the channel
      if (printInChannel) {
        return response
      }
      // At this point we have a big battle, reply via dm with a confirmation to channel
      for (const responseChunk of response){
        msg.author.send(responseChunk)
      }
      return discordutil.SUCCESS
    } else {
      return `there are no submissions yet, but you could be the one to change that!`
    }
  } else {
    return constants.MSG_SERVER_ONLY
  }
}

// TODO case for this?
//exports.
let fbcooldown = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: \`!fbcooldown SPAN\` to set the cooldown before a user pulled for showcase can submit again`
  }
  if (msg.guild) {
    if (discordutil.isMessageFromMod(msg)){
      const battleName = `${msg.channel.id}`
      if (!battledao.isBattleChannel(battleName)){
        return MSG_BATTLE_INACTIVE
      }
      // battledao.setBallotSize(battleName, input)
      return `not implemented yet`
    } else {
      return constants.MSG_MOD_ONLY
    }
  } else {
    return constants.MSG_SERVER_ONLY
  }
}
