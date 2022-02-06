const { Message } = require('discord.js')
const constants = require('../../util/constants')
const discordutil = require('../../util/discord')
const battledao = require('./battlecachedao')
const day = require('../../util/dayjs')
const rand = require('../../util/random')

let debug = msg => console.log(`battlectl: ${msg}`)

exports.newbattle = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Post \`!newbattle\` to start a new beat battle for this channel!`
  }
  if (msg.guild){
    if (discordutil.isMessageFromMod(msg)){
      const battleName = `${msg.channel.id}`
      if (battledao.isBattleActive(battleName) && input !== 'letsgo') {
        return `heads up, this resets the current battle. Are you ready for a new round? \`!newbattle letsgo\` to confirm!`
      }
      // TODO if input: stopsubs(input); return contextual response #69
      return battledao.newBattle(battleName)
    } else {
      return constants.MSG_MOD_ONLY
    }
  } else {
    return constants.MSG_SERVER_ONLY
  }
}

exports.submit = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Usage: Post a new message that starts with \`!submit https://link.to.your/beat\` to enter the battle in this channel! Make sure there's a space after your link if you want to write more in your message, otherwise it might not save right`
  }
  if (msg.guild) {
    const battleName = `${msg.channel.id}`
    if (!battledao.isBattleChannel(battleName)){
      return constants.MSG_BATTLE_INACTIVE
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

exports.unsubmit = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Usage: \`!unsubmit\` to remove your entry from a battle you \`!submit\`'d a link to`
  }
  if (msg.guild) {
    const battleName = `${msg.channel.id}`
    if (!battledao.isBattleChannel(battleName)){
      return constants.MSG_BATTLE_INACTIVE
    }
    //TODO: #105, we need to consider votes to allow unsubmission after the fact
    if (battledao.isSubmitOpen(battleName)) {
      let entrantName = msg.member.nickname || msg.member.user.username
      let entrantId = msg.member.id
      debug(`${entrantName} has unsubmitted for battle[${battleName}]`)
      return battledao.removeEntry(entrantId, battleName)
    }
    return `sorry, the deadline has passed and we can't change the submissions after the deadline in case it messes with voting - this will likely work in the future though`
  } else {
    return constants.MSG_SERVER_ONLY
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
      return constants.MSG_BATTLE_INACTIVE
    }
    if (discordutil.isMessageFromMod(msg)){
      return constants.MSG_FUTURE_FEATURE
    } else {
      return constants.MSG_MOD_ONLY
    }
  } else {
    return constants.MSG_SERVER_ONLY
  }
}

exports.submissions = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Post \`!submissions\` to see this battle's entries! Use \`!submissions here\` to print entries to this channel (no matter how big the list is)`
  }
  if (msg.guild) {
    const battleName = `${msg.channel.id}`
    if (!battledao.isBattleChannel(battleName)){
      return constants.MSG_BATTLE_INACTIVE
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
    return constants.MSG_SERVER_ONLY
  }
}
exports.subs = exports.sumbissions = exports.submissions

exports.deadlines = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: \`!deadlines\` to print submission and voting deadlines for this battle (if they're set)\n\nMods can use \`!stopsubs SPAN\` and \`!stopvotes SPAN\` to set these, see help for those commands for more info`
  }
  if (msg.guild) {
    const battleName = `${msg.channel.id}`
    if (!battledao.isBattleChannel(battleName)){
      return constants.MSG_BATTLE_INACTIVE
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
      response += 'No deadlines set! Mods can use `!stopsubs` and `!stopvotes` to set them'
    }
    return response
  } else {
    return constants.MSG_SERVER_ONLY
  }
}

exports.stopbattle = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: !stopbattle sets the submission AND voting deadlines to right now, stopping the battle in its *tracks*`
  }
  if (msg.guild) {
    if (discordutil.isMessageFromMod(msg)){
      const battleName = `${msg.channel.id}`
      if (!battledao.isBattleChannel(battleName)){
        return constants.MSG_BATTLE_INACTIVE
      }
      const deadline = new day.dayjs()
      battledao.setSubDeadline(battleName, deadline)
      if (battledao.isVotingOpen(battleName)) {
        battledao.setVotingDeadline(battleName, deadline)
      }
      return `The battle is now CLOSED! Anyone can see the entries with \`!submissions\`, and mods can use \`!stopsubs\` and \`!stopvotes\` to extend the battle, or \`!results\` to see the podium`
    } else {
      return constants.MSG_MOD_ONLY
    }
  } else {
    return constants.MSG_SERVER_ONLY
  }
}

exports.sd = function(input, msg){
  usage = "Usage: `!sd timespan` (or `!stopsubs timespan`) sets the submission deadline to `timespan` amount of time from the current hour. Example spans: 1w3d6h for 1 week, 3 days, and 6 hours; 1d12h for 36 hours; 90m for a real short deadline. You can use `!sd now` to set the deadline to right now too"
  if (input.toLowerCase() == 'help') {
    return usage
  }
  if (msg.guild) {
    if (discordutil.isMessageFromMod(msg)) {
      const battleName = `${msg.channel.id}`
      if (!battledao.isBattleChannel(battleName)) {
        return constants.MSG_BATTLE_INACTIVE
      }
      if (input && input.toLowerCase() == 'now') {
        const deadline = new day.dayjs()
        battledao.setSubDeadline(battleName, deadline)
        return `submissions for this battle are now CLOSED! \`!submissions\` to see the final list of entries`
      } else if (input) {
        const deadline = day.addTimespan(input)
        battledao.setSubDeadline(battleName, deadline)
        return `submissions are now due ${deadline.fromNow()}! (${day.fmtAsPST(deadline)})`
      } else {
        return usage
      }
    } else {
      return constants.MSG_MOD_ONLY
    }
  } else {
    return constants.MSG_SERVER_ONLY
  }
}
exports.stopsubs = exports.sd // TODO Keep the old alias for a release then ditch it

exports.vd = function(input, msg) {
  usage = "Usage: `!vd timespan` (or `!stopvotes timespan`) sets the voting deadline to `timespan` from now. Example spans: 1w1d for 8 days; 1d12h for 36 hours; 90m for a real short deadline. You can use `!vd now` to set the deadline to right now too"
  if (input.toLowerCase() == 'help') {
    return usage
  }
  if (msg.guild) {
    if (discordutil.isMessageFromMod(msg)) {
      const battleName = `${msg.channel.id}`
      if (!battledao.isBattleChannel(battleName)) {
        return constants.MSG_BATTLE_INACTIVE
      }
      if (input && input.toLowerCase() == 'now') {
        const deadline = new day.dayjs()
        battledao.setVotingDeadline(battleName, deadline)
        return `voting for this battle is now CLOSED! Mods can use \`!results X\` to see the top X entries ranked by votes`
      } else if (input) {
        const deadline = day.addTimespan(input)
        battledao.setVotingDeadline(battleName, deadline)
        return `votes are now due ${deadline.fromNow()}! (${day.fmtAsPST(deadline)})`
      } else {
        return usage
      }
    } else {
      return constants.MSG_MOD_ONLY
    }
  } else {
    return constants.MSG_SERVER_ONLY
  }
}
exports.stopvotes = exports.vd // TODO Keep the old alias for a release then ditch it

// TODO This is ez #33
//exports.
let maxvotes = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: #TODO usage info`
  }
  if (msg.guild) {
    if (discordutil.isMessageFromMod(msg)) {
      const battleName = `${msg.channel.id}`
      if (!battledao.isBattleChannel(battleName)) {
        return constants.MSG_BATTLE_INACTIVE
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

exports.getballot = function(input, msg) {
  const battleName = `${msg.channel.id}`
  const numEntries = battledao.getBattleSize(battleName)
  const ballotSize = battledao.getBallotSize(battleName)  // used in output sent to user
  if (input.toLowerCase() == 'help') {
    return `Usage: After submissions are closed, if there is a voting period, you can run \`!getballot\` in the channel where the battle occurred to recieve a numbered list of entries via DM. Once you have the list, DM back with \`!vote N\` or \`!vote N1, N2, Nmax\` to vote for your favorite ${numEntries} entries. `
  }
  if (msg.guild) {
    if (!battledao.isBattleChannel(battleName)) {
      return constants.MSG_BATTLE_INACTIVE
    }
    if (battledao.isVotingOpen(battleName)) {
      battledao.registerVoter(msg.author.id, battleName)
      const entries = battledao.getEntriesFor(battleName)
      const respArray = discordutil.formatBallotToArray(entries, ballotSize)
      for (let respMsg of respArray) {
        msg.author.send(respMsg)
      }
      return 'success'
    } else if (battledao.isSubmitOpen(battleName)) {
      const subdl = battledao.getSubDeadline(battleName)
      const output = `this battle is still taking submissions until ${day.fmtAsPST(subdl)}, so you can't start voting until then!`
      return output
    } else {
      return constants.MSG_BATTLE_CLOSED
    }
  } else {
    return constants.MSG_SERVER_ONLY
  }
}

exports.vote = function(input, msg) {
  // Validation and text for help output and rest of voting process
  if (msg.guild) {
    return constants.MSG_DM_ONLY
  }
  if (!battledao.isVoterRegistered(msg.author.id)) {
    return `you haven't registered to vote for a battle yet. Run \`!getballot\` in a battle channel to register, you can re-vote if you like - but you have to register for every vote`
  }
  // This REQUIRES a registered voter, must go with isVoterRegistered
  const battleName = battledao.getBattleIdByVoter(msg.author.id)
  const ballotSize = battledao.getBallotSize(battleName)
  const numEntries = battledao.getBattleSize(battleName)
  if (input.toLowerCase() == 'help') {
    return `Usage: After submissions are closed, if there is a voting period, you can run \`!getballot\` in the channel where the battle occurred to recieve a numbered list of entries via DM. Once you have the list, DM back with \`!vote N\` or \`!vote N1, N2, Nmax\` to vote for your favorite ${numEntries} entries. `
  }
  if (!battledao.isBattleActive(battleName)) {
    return constants.MSG_BATTLE_INACTIVE
  }
  if (battledao.isVotingOpen(battleName)) {
    //Validation code until the next comments
    let voteItems = input.split(','), voteSet = new Set(), voteArrayValidated = []
    if (voteItems.length > ballotSize) {
      return `the max number of tracks you can vote for is ${ballotSize}, please slap a limiter on your votes and try again`
    }
    for (let i of voteItems) {
      if (!parseInt(i)) {
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
    if (battledao.voteAndDeregister(msg.author.id, voteArrayValidated)) {
      return `your vote for track(s) **[ ${voteArrayValidated.join(', ')} ]** has been counted! if you need to change your vote before the deadline is over, you need to run \`!getballot\` in the battle channel again`
    } else {
      log(`odd behavior: voteAndDereg failed for user [${msg.author.id}] in battle [${battleName}]`)
      return `...well this is awkward but the voting machine is jammed, ping jakebelow directly below this message for support`
    }
  } else {
    const vdl = battledao.getVotingDeadline(battleName)
    return `sorry but voting closed for this battle at ${day.fmtAsPST(vdl)}, any new votes are ignored`
  }
}

exports.results = function(input, msg) {
  const battleName = `${msg.channel.id}`
  let podiumCapacity = battledao.getPodiumSize(battleName)
  if (input.toLowerCase() == 'help') {
    return `Usage: \`!results\` can be run by a mod after the voting deadline has passed to get the top `
  }
  if (msg.guild) {
    if (discordutil.isMessageFromMod(msg)) {
      if (!battledao.isBattleChannel(battleName)) {
        return constants.MSG_BATTLE_INACTIVE
      }
      if (!battledao.isVotingOpen(battleName)) {
        const voteCountObj = battledao.getVoteCountForBattle(battleName)
        const submissionMapObj = battledao.getEntriesFor(battleName)
        // Quick parameter handling if you just want top winner or whatev
        if (input && parseInt(input)) {
          podiumCapacity = Math.max(parseInt(input), 1) // simple input filter
        }
        const showVotes = false
        const response = discordutil.formatPodiumToArray(submissionMapObj, voteCountObj, podiumCapacity, showVotes)
        for (let respMsg of response) {
          msg.author.send(respMsg)
        }
        return 'trophy'
      } else {
        // Creative message generation
        const now = new day.dayjs()
        const subdl = battledao.getSubDeadline(battleName)
        const subovertxt = subdl? ` submissions are over ${now.to(subdl)} and` : ''
        const vdl = battledao.getVotingDeadline(battleName)
        return `sorry but the battle has not concluded -${subovertxt} voting ends at ${day.fmtAsPST(vdl)}, you can get official results then!`
      }
    } else {
      return constants.MSG_MOD_ONLY
    }
  } else {
    return constants.MSG_SERVER_ONLY
  }
}
