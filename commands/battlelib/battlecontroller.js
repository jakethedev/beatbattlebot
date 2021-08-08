const { Message } = require('discord.js')
const discordutil = require('../../util/discord')
const battledao = require('./battlecachedao')
const day = require('../../util/dayjs')
const rand = require('../../util/random')

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
      const battleName = `${msg.channel.id}`
      if (battledao.isBattleActive(battleName) && input !== 'letsgo') {
        return `heads up, this resets the current battle. Are you ready for a new round? \`!newbattle letsgo\` to confirm!`
      }
      // TODO if input: setDeadline(input)
      return battledao.newBattle(battleName)
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
      return `sorry but this battle is closed, the deadline was ${day.fmtAsPST(subdl)}`
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
let modsubmit = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Usage: !modsubmit \@discordmember https://their-link - this is a mod-only command for special case entries that need to be added after a submission deadline`
  }
  if (msg.guild) {
    const battleName = `${msg.channel.id}`
    if (!battledao.isBattleChannel(battleName)){
      return MSG_BATTLE_INACTIVE
    }
    if (discordutil.isPowerfulMember(msg)){
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
    const battleName = `${msg.channel.id}`
    if (!battledao.isBattleChannel(battleName)){
      return MSG_BATTLE_INACTIVE
    }
    if (battledao.isBattleActive(battleName)){
      let submissionMapObj = battledao.getEntriesFor(battleName)
      const ordered = input.includes('chron')
      if (!ordered) {
        submissionMapObj = rand.getShuffledCopyOfObject(submissionMapObj)
      }
      // Just to explain: battle entry lists break the 2000 character limit pretty fast, so 
      // this is a fast way to paginate the response, bot.js knows to msg.reply the first entry of an array
      // and the rest are just sent to the channel the command was received in
      let numEntries = Object.keys(submissionMapObj).length
      let responseHeader = `${numEntries} total, check em out!\n`
      if (ordered) {
        responseHeader = `${numEntries} total, these are in the same order I got them in!\n`
      }
      let response = [responseHeader]
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
      response[curIdx+1] = `--> Heads up, there's a lot of heat in this list :fire: <--`
      debug(`pages of response: ${response.length}`)
      // If we've got a small battle or someone says "here", print to the channel
      let largeBattle = Object.entries(submissionMapObj).length > 10
      let printInChannel = !largeBattle || input.includes('here')
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
      return `there are no submissions yet, but you could be the one to change that!`
    }
  } else {
    return MSG_SERVER_ONLY
  }
}

exports.deadlines = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: \`!deadlines\` to print submission and voting deadlines for this battle (if they're set)\n\nMods can use \`!setdeadline SPAN\` and \`!votingends SPAN\` to set these, see help for those commands for more info`
  }
  if (msg.guild) {
    const battleName = `${msg.channel.id}`
    if (!battledao.isBattleChannel(battleName)){
      return MSG_BATTLE_INACTIVE
    }
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
    return `Usage: \`!setdeadline SPAN\` to set the submission deadline of this battle to SPAN time from now! You can use numbers, w, d, h, and m to specify how long in weeks, days, hours, and minutes the battle should run\nExample: \`!setdeadline 1w2d3h15m\` will set the deadline to 1 week, 2 days, 3 hours, and 15 minutes from now (days and hours are rounded forward to the next clean hour)`
  }
  if (msg.guild) {
    if (discordutil.isPowerfulMember(msg)){
      const battleName = `${msg.channel.id}`
      if (!battledao.isBattleChannel(battleName)){
        return MSG_BATTLE_INACTIVE
      }
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

exports.votingends = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: !votingends SPAN to set the voting deadline of this battle to SPAN time from now! You can use numbers, w, d, h, and m to specify how long in weeks, days, hours, and minutes the voting period should run\nExample: \`!votingends 1w5d2h30m\` will set the deadline to 1 week, 5 days, 2 hours, and 30 minutes from now (days and hours are rounded forward to the next clean hour)`
  }
  if (msg.guild) {
    if (discordutil.isPowerfulMember(msg)){
      const battleName = `${msg.channel.id}`
      if (!battledao.isBattleChannel(battleName)){
        return MSG_BATTLE_INACTIVE
      }
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

exports.stopbattle = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: !stopbattle sets the submission AND voting deadlines to right now, stopping the battle in its *tracks*`
  }
  if (msg.guild) {
    if (discordutil.isPowerfulMember(msg)){
      const battleName = `${msg.channel.id}`
      if (!battledao.isBattleChannel(battleName)){
        return MSG_BATTLE_INACTIVE
      }
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
      const battleName = `${msg.channel.id}`
      if (!battledao.isBattleChannel(battleName)){
        return MSG_BATTLE_INACTIVE
      }
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

exports.stopvotes = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: !stopvotes sets the voting deadline to right now, locking in the current podium`
  }
  if (msg.guild) {
    if (discordutil.isPowerfulMember(msg)){
      const battleName = `${msg.channel.id}`
      if (!battledao.isBattleChannel(battleName)){
        return MSG_BATTLE_INACTIVE
      }
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

// TODO This is ez #33
//exports.
let maxvotes = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: #TODO usage info`
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

exports.getballot = function(input, msg){
  const battleName = `${msg.channel.id}`
  // use this in output sent to user
  const ballotSize = battledao.getBallotSize(battleName)
  if (input.toLowerCase() == 'help') {
    return `Usage: After submissions are closed, if there is a voting period, you can run \`!getballot\` in the channel where the battle occurred to recieve a numbered list of entries via DM. Once you have the list, DM back with \`!vote N\` or \`!vote N1, N2, Nmax\` to vote for your favorite ${max_entries} entries. `
  }
  if (msg.guild) {
    if (!battledao.isBattleChannel(battleName)){
      return MSG_BATTLE_INACTIVE
    }
    battledao.registerVoter(msg.author.id, battleName)
    const entries = battledao.getEntriesFor(battleName)
    const respArray = discordutil.formatBallotToArray(entries)
    for (let respMsg of respArray) {
      msg.author.send(respMsg)
    }
    return 'success'
  } else {
    return MSG_SERVER_ONLY
  }
}

exports.vote = function(input, msg){
  const battleName = battledao.getBattleIdByVoter(msg.author.id)
  const ballotSize = battledao.getBallotSize(battleName)
  const numEntries = battledao.getBattleSize(battleName)
  if (input.toLowerCase() == 'help') {
    return `Usage: After submissions are closed, if there is a voting period, you can run !getballot in the channel where the battle occurred to recieve a numbered list of entries via DM. Once you have the list, DM back with "!vote N" or "!vote N1, N2, N3" to vote for your favorite ${max_entries} entries. `
  }
  if (msg.guild) {
    return MSG_SERVER_ONLY
  } else {
    if (battledao.isVotingOpen){
      //Validation code until the next comments
      if (!battledao.isVoterRegistered(msg.author.id)) {
        return `you haven't registered to vote for a battle yet. Run !getballot in a battle channel to register, you can re-vote but you have to register for every vote`
      }
      let voteItems = input.split(','), voteSet = new Set(), voteArrayValidated = []
      if (voteItems.length > ballotSize) {
        return `the max number of tracks you can vote for is ${ballotSize}, please slap a limiter on your votes and try again`
      }
      for (let i of voteItems){
        if (!parseInt(i)){
          return `sorry, this vote was not formatted right: please make sure your entries are **comma-separated positive numbers** from the list provided by \`!getballot\`.\n\nExamples: \`!vote 7\`, \`!vote 1, 2, 3\` `
        }
        const voteEntryId = Math.abs(parseInt(i)) // no room for negativity
        if (voteEntryId > numEntries) {
          return `you voted for entry number [${voteEntryId}], but we only have ${numEntries} track(s)... Please double check the numbers and try again`
        }
        //Actually counting each vote, ignoring multiple votes for the same entry
        voteSet.add(voteEntryId)
      }
      voteSet.forEach((v) => voteArrayValidated.push(v))
      battledao.voteAndDeregister(msg.author.id, voteArrayValidated)
      return `your vote for track(s) [${voteArrayValidated.join(', ')}] has been counted! if you need to change your vote before the deadline is over, you need to run \`!getballot\` in the battle channel again` 
    } else {
      const dl = battledao.getVotingDeadline(battleName)
      return `voting closed for this battle at ${dl}, your vote has not been saved`
    }
  }
}

exports.results = function(input, msg){
  const battleName = `${msg.channel.id}`
  const podiumCapacity = battledao.getPodiumSize(battleName)
  if (input.toLowerCase() == 'help') {
    return `Usage: \`!results\` can be run by a mod after the voting deadline has passed to get the top `
  }
  if (msg.guild) {
    if (discordutil.isPowerfulMember(msg)){
      if (!battledao.isBattleChannel(battleName)){
        return MSG_BATTLE_INACTIVE
      }
      // get max entrants
      //    max entrants getter: if (!battle.maxvotes) default 10
      // get indexed subs
      // get votes
      // sum votes by sub index
      // get max entrants by sum
      //    tie for last: config.handleBattleTies: alpha,chrono,random
      // format response
      return `not implemented yet`
    } else {
      return MSG_MOD_ONLY
    }
  } else {
    return MSG_SERVER_ONLY
  }
}
