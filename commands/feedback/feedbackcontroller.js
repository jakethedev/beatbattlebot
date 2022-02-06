const { Message } = require('discord.js')
const discordutil = require('../../util/discord')
const servercache = require('../../util/servercachedao')
const feedbackdao = require('./feedbackdao')
const day = require('../../util/dayjs')
const rand = require('../../util/random')

const MSG_FUTURE_FEATURE = "this feature is in the works and will be available in a future version of the bot"
const MSG_SERVER_ONLY = "this command needs to be run in a server channel where this bot is active"
const MSG_DM_ONLY = "this command needs to be sent to the bot via DM"
const MSG_MOD_ONLY = "this is a mod-only command"
const MSG_CHANNEL_INACTIVE = "this channel is not open for feedback operations at the moment, reach out to a mod if that's a surprise"
const MSG_BATTLE_CLOSED = "the battle in this channel is over and done, hope to see you next time!"

let debug = msg => console.log(`feedbacklib: ${msg}`)

function _submitLink (userid, link) {
  // TODO make safe before or after notes
  //    also return output should be note-presence sensitive
  return 'link submissions disabled at the moment, stay tuned!'
}

function _submitNotes (userid, notes) {
  // TODO make safe before or after Link
  //    also return output should be link-presence sensitive
  return 'notes submissions disabled at the moment, stay tuned!'
}

function _getFeedbackEntryAndStageUser() {
  const feedbackOrder = servercache.getFeedbackOrder(serverid)
  // TODO get weighted list, pick one 
  return `this is a feedback entry, user not staged, TBD`
}

function _getCooldownTimestamp(chanid, userid) {
  // TODO get weighted list, 
  return { timestamp: "NOTATIMESTAMP", timespan: "NOTASPAN" }
}

function _putUserInSpotlight(chanid) {
  return `user has not been queued for feedback TBD`
}

function _feedbackCompletedForQueuedUser()(chanid) {
  return `user has not been set for cooldown, TBD`
}

function _userIsInCooldown(chanid, userid) {
  // TODO check if user has cooldown date after now in this channel
  return false
}

function _openChannelForFeedback(chanid) {
  return `channel ${chanid} is OPEN for FEEDBACK`
}

function _closeChannelForFeedback(chanid) {
  return `channel ${chanid} is CLOSED for FEEDBACK`
}

function _resetFeedbackChannel(chanid) {
  return `feedback for channel ${chanid} has not been reset TBD`
}

exports.fb = function(input = '', msg) {
  input = `${input}` // typescript.js
  const userid = msg.author.id
  const chanid = msg.channel ? msg.channel.id : "DM"
  const serverid = msg.guild ? msg.guild.id : "DM"
  let response = `Usage: !fb`

  if (input.startsWith('https://')) { // link indicates a submission and optional notes
    if (_userIsInCooldown(userid)){
      const { timestamp, timespan } = _getCooldownTimestamp(userid)
      return `you're still in cooldown from your last submission, more detail coming in a future bot version`
    }
    let [link, ...notes] = input.split(/\s/)
    if (notes && notes.length > 0) {
      _submitNotes(userid, notes.join(' '))
    }
    return _submitLink(userid, link.trim())
  } else if (input == 'notes') { // save notes from entrant for feedback
    // TODO: safe to do before or after entry
    return _submitNotes(userid, input)
  } else if (input == 'open') { // open the channel to submissions
    if (discordutil.isMessageFromMod(msg)) {
      return _openChannelForFeedback() 
    }
    return MSG_MOD_ONLY
  } else if (input == 'close') { // stop the channel from accepting submissions
    if (discordutil.isMessageFromMod(msg)) {
      return _closeChannelForFeedback(chanid)
    }
    return MSG_MOD_ONLY
  } else if (input.startsWith('cooldown')) { //  MODONLY: adjust cooldown time
    // TODO: reset? clean cooldown list. int? set cooldown. else? error
    return MSG_FUTURE_FEATURE
  } else if (input == 'method') { // MODONLY: change way of choosing entries
    // TODO: set the method for feedback: random, weighted, chrono
    return MSG_FUTURE_FEATURE
  } else if (input == 'start') { // MODONLY: stage a user for feedback
    return _getFeedbackEntryAndStageUser()
  } else if (input == 'done') { // MODONLY: feedback is done, put user in cooldown
    if (discordutil.isMessageFromMod(msg)) {
      return _feedbackCompletedForQueuedUser()
    }
    return MSG_MOD_ONLY
  } else if (input.startsWith('reset')) { // MODONLY: wipe the channel's fb queue and cooldowns
    if (discordutil.isMessageFromMod(msg)) {
      if (input.includes('letsgo')) {
        return _resetFeedbackChannel(chanid)
      }
      return "warning, this wipes out this channel's feedback queue and resets all cooldowns, are you sure? run `!fb reset letsgo` to confirm"
    }
    return MSG_MOD_ONLY
  } else {
    debug('default case return help')
  }
  // delete message upon success
  return 'pong'
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
    return MSG_SERVER_ONLY
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
      const largeBattle = Object.entries(submissionMapObj).length > 10
      const shuffled = input.includes('shuf')
      const printInChannel = !largeBattle || input.includes('here')
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
    return MSG_SERVER_ONLY
  }
}

// TODO case for this?
//exports.
let fbcooldown = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: \`!fbcooldown SPAN\` to set the cooldown before a user pulled for feedback can submit again`
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
      return MSG_MOD_ONLY
    }
  } else {
    return MSG_SERVER_ONLY
  }
}
