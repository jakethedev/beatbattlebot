const { Message } = require('discord.js')
const discordutil = require('../../util/discord')
const feedbackdao = require('./feedbackdao')
const day = require('../../util/dayjs')
const rand = require('../../util/random')

const MSG_SERVER_ONLY = "this command needs to be run in a server channel where this bot is active"
const MSG_DM_ONLY = "this command needs to be sent to the bot via DM"
const MSG_MOD_ONLY = "this is a mod-only command"
const MSG_CHANNEL_INACTIVE = "this channel is not open for feedback operations at the moment, reach out to a mod if that's a surprise"
const MSG_BATTLE_CLOSED = "the battle in this channel is over and done, hope to see you next time!"

let debug = msg => console.log(`feedbacklib: ${msg}`)

function _submitLink (userid, link) {
  // TODO make safe before or after notes
  return 'feedback submissions disabled at the moment, stay tuned!'
}

function _submitNotes (userid, notes) {
  // TODO make safe before or after Link
  return 'feedback submissions disabled at the moment, stay tuned!'
}

function _getFeedbackEntryAndStageUser() {
  // TODO get weighted list, 
}

exports.fb = function(input = '', msg, client) {
  input = `${input}` // typescript.diy
  if (input.startsWith('https://')) {
    // TODO verify user is not in cooldown  
    inputarr = input.split(/\s/)
    if (inputarr[1]) {
      // _submitNotes(input.substring(indexof(/s/)))
    }
    link = inputarr[0]
    return _submitLink(msg.author.id, link.trim())
  } else if (input == 'notes') {
    // save notes to an entry spot, safe to do before or after entry
    return _submitNotes(msg.author.id, input)
  } else if (input == 'go') {
    if (discordutil.isPowerfulMember(msg.author)) {
      return _getFeedbackEntryAndStageUser()
    }
    return MSG_MOD_ONLY
  } else if (input == 'chill') {
    // mod only, put userid: timestamp in the cooldown list
  } else if (input == 'reset') {
    // mod only, wipe feedback data for this channel, require letsgo confirmation
  } else if (input.startsWith('cooldown')) {
    // mod only, adjust cooldown time
  } else {
    debug('default case return help')
  }
  // delete message upon success


  // options:
  //  !fb [help] for info and usage
  //  !fb link to submit for feedback, verifies user is not on cooldown for receiving fb and provides clear output
  //  !fbget by a mod gets an entry by DM, sets lastuser to $userid
  //  !fbcomplete/chill by a mod sets cooldown for $userid, leaves lastuser along
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
    if (discordutil.isPowerfulMember(msg)){
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
