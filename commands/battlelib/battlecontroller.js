const { Message } = require('discord.js')
const discordutil = require('../../util/discord')
const battledao = require('./battlecachedao')
const day = require('../../util/dayjs')

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
    return `Usage: Post a new message that starts with \`!submit https://link.to.your/beat\` to enter the battle in this channel! Make sure there's a space after your link if you want to write more in your message, otherwise it might not save right` 
  }
  if (msg.guild) {
    let entrantId = msg.member.id
    // Note: nickname changes take time to propagate, so nickchange -> submit can result in the old nick saving instead
    let entrantName = msg.member.nickname || msg.member.user.username
    let battleName = `${msg.guild.name}_${msg.channel.name}`
    const link = input.split(' ')[0].trim()
    debug(`${entrantName} has submitted ${link} for battle[${battleName}]`)
    if (!link.includes('https')) {
      return `the first word after submit doesn't look like a valid link, make sure it's an *https* address then try again!`
    }
    if (!battledao.isSubmitOpen(battleName)){
      const subdl = battledao.getSubDeadline(battleName)
      return `sorry but this battle is closed, the deadline was ${day.fmtAsPST(subdl)}`
    }
    return battledao.addEntry(entrantId, entrantName, link, battleName)
  } else {
    return MSG_SERVER_ONLY
  }
}

//exports.
let modsubmit = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Usage: !modsubmit \@discordmember https://their-link - this is a mod-only command for special case entries that need to be added after a submission deadline` 
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

exports.submissions = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Post \`!submissions\` to see this battle's entries! Use \`!submissions here\` to print entries to this channel (no matter how big the list is)`
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
      // TODO move to subroutine or dao, perhaps discordutil.prepareLargeRespone?
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
      return discordutil.SUCCESS
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
    let battleName = `${msg.guild.name}_${msg.channel.name}`
    let subdl = battledao.getSubDeadline(battleName)
    let votedl = battledao.getVotingDeadline(battleName)
    let response = "deadlines for this battle:\n"
    if (subdl) {
      response += `ENTRIES: Submissions are due ${subdl.fromNow()} (at ${day.fmtAsPST(subdl)})\n`
    }
    if (votedl) {
      response += `VOTING: If subs are closed, votes are due ${votedl.fromNow()} (${day.fmtAsPST(votedl)})\n`
    }
    if (!subdl && !votedl) {
      response += 'No deadlines set! Mods can use `!setdeadline` and `!votingends` to set them'
    }
    return response
  } else {
    return MSG_SERVER_ONLY
  }
}

exports.setdeadline = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: !setdeadline SPAN to set the submission deadline of this battle to SPAN time from now! You can use numbers, w, d, h, and m to specify how long in weeks, days, hours, and minutes the battle should run\nExample: \`!setdeadline 1w2d3h15m\` will set the deadline to 1 week, 2 days, 3 hours, and 15 minutes from now (days and hours are rounded forward to the next clean hour)`
  }
  if (msg.guild) {
    if (discordutil.isPowerfulMember(msg)){
      let battleName = `${msg.guild.name}_${msg.channel.name}`
      const deadline = day.addTimespan(input)
      battledao.setSubDeadline(battleName, deadline)
      return `Submission deadline changed, entries due ${deadline.fromNow()}! (${day.fmtAsPST(deadline)})`
    } else {
      return MSG_MOD_ONLY
    }
  } else {
    return MSG_SERVER_ONLY
  }
}

//exports.
let votingends = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: !votingends SPAN to set the voting deadline of this battle to SPAN time from now! You can use numbers, w, d, h, and m to specify how long in weeks, days, hours, and minutes the voting period should run\nExample: \`!votingends 1w5d2h30m\` will set the deadline to 1 week, 5 days, 2 hours, and 30 minutes from now (days and hours are rounded forward to the next clean hour)`
  }
  if (msg.guild) {
    if (discordutil.isPowerfulMember(msg)){
      let battleName = `${msg.guild.name}_${msg.channel.name}`
      const deadline = day.addTimespan(input)
      battledao.setVotingDeadline(battleName, deadline)
      return `Voting deadline changed, votes are due ${deadline.fromNow()}! (${day.fmtAsPST(deadline)})`
    } else {
      return MSG_MOD_ONLY
    }
  } else {
    return MSG_SERVER_ONLY
  }
}

//exports.
let stopbattle = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: !stopbattle sets the submission AND voting deadlines to right now, stopping the battle in its *tracks*`
  }
  if (msg.guild) {
    if (discordutil.isPowerfulMember(msg)){
      let battleName = `${msg.guild.name}_${msg.channel.name}`
      const deadline = new day.dayjs()
      battledao.setSubDeadline(battleName, deadline)
      if (battledao.isVotingOpen(battleName)) {
        battledao.setVotingDeadline(battleName, deadline)
      }
      return `The battle is now CLOSED! Anyone can see the entries with \`!submissions\`, and mods can use \`!setdeadline\` and \`!votingends\` to extend the battle, or \`!results\` to see the podium`
    } else {
      return MSG_MOD_ONLY
    }
  } else {
    return MSG_SERVER_ONLY
  }
}

exports.stopsubs = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: !stopsubs sets the submission deadline to right now, preventing further submissions`
  }
  if (msg.guild) {
    if (discordutil.isPowerfulMember(msg)){
      let battleName = `${msg.guild.name}_${msg.channel.name}`
      const deadline = new day.dayjs()
      battledao.setSubDeadline(battleName, deadline)
      return `submissions for this battle are now CLOSED! \`!submissions\` to see the final list of entries`
    } else {
      return MSG_MOD_ONLY
    }
  } else {
    return MSG_SERVER_ONLY
  }
}

//exports.
let stopvotes = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: !stopvotes sets the voting deadline to right now, locking in the current podium`
  }
  if (msg.guild) {
    if (discordutil.isPowerfulMember(msg)){
      let battleName = `${msg.guild.name}_${msg.channel.name}`
      const deadline = new day.dayjs()
      battledao.setVotingDeadline(battleName, deadline)
      return `voting for this battle is now CLOSED! Mods can use \`!results X\` to see the top X entries ranked by votes`
    } else {
      return MSG_MOD_ONLY
    }
  } else {
    return MSG_SERVER_ONLY
  }
}

// TODO Whiteboard this idea
//exports.
let maxvotes = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: #TODO usage info`
  }
  if (msg.guild) {
    if (discordutil.isPowerfulMember(msg)){
      return `not implemented yet`
    } else {
      return MSG_MOD_ONLY
    }
  } else {
    return MSG_SERVER_ONLY
  }
}

//exports.
let getballot = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: #TODO usage info`
  }
  if (msg.guild) {
    //TODO THIS IS WHERE THE SAUSAGE GETS MADE
    return `not implemented yet`
  } else {
    return MSG_SERVER_ONLY
  }
}

//exports.
let vote = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: #TODO usage info`
  }
  if (msg.guild) {
    return MSG_SERVER_ONLY
  } else {
    const battleName = `${msg.guild.name}_${msg.channel.name}`
    if (battledao.isVotingOpen){
      //TODO if !registered: getballot CTA
      let voteItems = input.split(','), parsedVotes = []
      for (let i in voteItems){
        if (!parseInt(i)){
          return "sorry, this vote was entered wrong: please make sure your entries are COMMA-SEPARATED numbers in the list you got from running \`!getballot\` (spaces are ignored)" 
        }
        parsedVotes.push(parseInt(i))
      }
      battledao.voteAndDeregister(msg.author.id, parsedVotes)
    } else {
      const dl = battledao.getVotingDeadline(battleName)
      return `voting closed for this battle at ${dl}, your vote has not been saved`
    }
  }
}

//exports.
let results = function(input, msg){
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
