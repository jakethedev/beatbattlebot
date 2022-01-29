const debug = msg => console.log(`discordutil: ${msg}`)

// Relies on discord permission scheme: https://discord.com/developers/docs/topics/permissions
exports.isMessageFromMod = function(discordJsMsg){
  const isAdmin = discordJsMsg.member.permissions.any(['ADMINISTRATOR', 'MANAGE_CHANNELS'])
  //TODO: const hasBotRole = msg.member.roles.any() // #15
  return isAdmin // || hasBotRole
}

exports.getRoleFromMessageGuild = function(roleinput, message){
  rolesearch = roleinput.trim().toLowerCase()
  return message.guild.roles.cache.find(role => role.name.toLowerCase() === rolesearch)
}

// A means of interactive response that allows more complex/longform commands to run
const reactionmap = {
  'loading': '⏳',
  'success': '☑',
  'failure': '❌',
  'play': '▶',
  'pause': '⏸',
  'stop': '�',
  'skip': '⏩',
  'fire': '�',
  'question': '❔',
  'confused': '❔',
  'heart': '�',
  'trophy': '🏆'
}

const reactionkeys = Object.keys(reactionmap)

exports.reactionnames = reactionkeys
exports.emojifromname = (name) => reactionmap[name]
// Autocomplete doesn't work right anyways, so here's some constants for easy access
// future me here comin in to say this never got used lmao
for (let key of reactionkeys){
  exports[key.toUpperCase()] = key
}

exports.formatSubmissionsToArray = function(entryJson, shuffled = false) {
  // Just to explain: battle entry lists break the 2000 character limit pretty fast, so
  // this is a fast way to paginate the response, bot.js knows to msg.reply the first entry of an array
  // and the rest are just sent to the channel the command was received in
  let numEntries = Object.keys(entryJson).length
  let responseHeader = `${numEntries} total, in the same order I got them:\n`
  if (shuffled) {
    responseHeader = `${numEntries} total, freshly shuffled up for ya:\n`
  }
  let response = [responseHeader]
  let curIdx = 0
  // TODO move to subroutine, perhaps discordutil.prepareLargeResponse(obj, formatter)?
  for (const [id, entry] of Object.entries(entryJson)) { // { key=user: value=link }
    const { link, displayname } = entry
    let miniBuffer = ` - ${displayname} -> <${link}>\n`
    if (response[curIdx].length + miniBuffer.length >= 1600){
      curIdx++
      response[curIdx] = '' // *ding* typewriter sounds
    }
    response[curIdx] += miniBuffer
  }
  response[curIdx+1] = `--> Heads up, there's a lot of heat in this list :fire: <--`
  debug(`submission pages: ${response.length}`)
  return response
}

exports.formatBallotToArray = function(entryJson, ballotSize) {
  let numEntries = Object.keys(entryJson).length
  let responseHeader = `Here is the final submission list of ${numEntries} entries:\n`
  let response = [responseHeader]
  let pageIdx = 0, entryNum = 1
  // TODO move to subroutine, perhaps discordutil.prepareLargeResponse(obj, formatter)?
  for (const [id, entry] of Object.entries(entryJson)) { // { key=user: value=link }
    const { link, displayname } = entry
    let miniBuffer = `**[${entryNum}]** ${displayname}'s entry: <${link}>\n`
    if (response[pageIdx].length + miniBuffer.length >= 1600){
      pageIdx++
      response[pageIdx] = '' // *ding* typewriter sounds
    }
    response[pageIdx] += miniBuffer
    entryNum++
  }
  response[pageIdx+1] = `\n\n***How to Vote!***
Send a DM to me formatted just like \`!vote X\` or \`!vote X, Y, Z\`. Replace X (and Y and Z) with the **[number]** of the track(s) you like. You can vote for a MAXIMUM of **${ballotSize}** track(s) in this battle. Voting for the same track multiple times will only count as one vote, so choose wisely!

Examples:
  \`!vote 13\`
  \`!vote 6, 9, 420\`

Heads up: once you vote, you'll need to run \`!getballot\` in the same channel if you need to change your vote`
  debug(`ballot pages: ${response.length}`)
  return response
}

exports.formatPodiumToArray = function(entryJson, voteCountObj, podiumCapacity, showVoteCount = false) {
  //TODO Handle ties
  //    tie for last: config.handleBattleTies: alpha,chrono,random
  //TODO Handle not-enough-entrants for podium
  // Sort the vote indexes, then we have the order - winner declared! The rest is formatting and tie mgmt
  const numEntries = Object.keys(entryJson).length
  const sortedVoteIndexes = Object.entries(voteCountObj).sort(([,a],[,b]) => parseInt(b) - parseInt(a)) // Comparator based on vote count, expects voteCounter to look like {'1':15,'2':7,'3':11} where id is the index of the entry, key is votes
  const podiumSize = Math.min(sortedVoteIndexes.length, podiumCapacity)
  // TODO: yeet 0-vote entries, output tiebreak method
  let responseHeader = `**-- THE RESULTS ARE IN --**\nHere are the highest voted ${podiumSize} tracks of ${numEntries} entries:\n\n`
  // Response is our output array, pageIdx is for paginating that array for discord msg constraints,
  //   entryOutputCounter is num entries added to response, podiumPlace differs from count due to ties
  let response = [responseHeader], pageIdx = 0, entryOutputCounter = 0, podiumPlace = 1
  for (let [ voteidx, votecount ] of sortedVoteIndexes) {
    // Now to format each of the sorted entries into output!
    let entryKeyIdx = parseInt(voteidx) - 1 // voteidx was adjusted for user interaction
    let entryKey = Object.keys(entryJson)[entryKeyIdx] // MAGIC! ES6 objects maintain order, we can rely on this
    // TODO get these details { broken up } and set in miniBuffer in a cute way
    let { displayname, link } = entryJson[entryKey]
    debug(`formatpodium: user ${displayname} had ${votecount} votes`)
    // TODO: optional: showVoteCount
    let miniBuffer = `> Rank ${podiumPlace}: ${displayname}'s track ${link}\n\n`
    // This could still be a couple pages depending on server settings for max podium size
    if (response[pageIdx].length + miniBuffer.length >= 1600){
      pageIdx++
      response[pageIdx] = '' // *ding* typewriter sounds
    }
    response[pageIdx] += miniBuffer
    entryOutputCounter++
    podiumPlace++
    if (entryOutputCounter == numEntries && entryOutputCounter < podiumSize) {
      //note: not enough entries to fill the podium
      log(`not enough entries for podium, expected ${podiumSize} but got puny ${entrySize}`)
    }
    // TODO this cuts off hard at podiumSize, no tie sanity or anything
    if (entryOutputCounter == podiumSize) {
      // Better luck next time to everyone who didn't make it
      break
    }
  }
  response[pageIdx+1] = `\nThanks for using battlebot! :blue_heart: If you'd like to start another battle, just run \`!newbattle letsgo\` in your battle channel :boxing_glove:`
  debug(`podium pages: ${response.length}`)
  return response
}