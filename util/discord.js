const debug = msg => console.log(`discordutil: ${msg}`)

// Relies on discord permission scheme: https://discord.com/developers/docs/topics/permissions
exports.isPowerfulMember = function(discordJsMsg){
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

exports.formatPodiumToArray = function(entryJson, voteCountObj, maxResults) {
  if (true)
    return ['still under construction, but very nearly done!']
  //TODO Handle ties
  //TODO Handle not-enough-entrants for podium
        // get max entrants by sum
        //    tie for last: config.handleBattleTies: alpha,chrono,random
        // format response
  const numResults = Math.min(sortedVoteIndexes.length, maxResults) // TODO: yeet 0-vote entries
  /* //From notebook sesh
   * let place = 1
   * for (let voteidx in Object.keys(sortedVoteIndexes)) {
   *   entryKeyIdx = parseInt(voteidx) - 1 // voteidx was adjusted for user interaction
   *   entryKey = Object.keys(entryJson)[entryKeyIdx] // MAGIC!
   *   entryDetails = entryJson[entryKey]
   *   response += `Rank ${place}: entryDetails`
   *   if place == numresults:
   *      break
   * }
   */
  let responseHeader = `Here are the highest voted ${maxResults} tracks of ${numEntries} entries:\n`
  let response = [responseHeader]
  // Sort the vote indexes, then we have the order
  const sortedVoteIndexes = Object.entries(voteCountObj).sort(([,a],[,b]) => a-b) // Comparator based on vote count, expects voteCounter to look like {'1':15,'2':7,'3':11} where id is the index of the entry, key is votes

  // Run through sorted entries to buffer them to strings for user response
  let pageIdx = 0, entryOutputCounter = 0
  for (const [id, entry] of Object.entries(entryJson)) { // { key=user: value=link }
    if (response[pageIdx].length + miniBuffer.length >= 1600){
      pageIdx++
      response[pageIdx] = '' // *ding* typewriter sounds
    }
    response[pageIdx] += miniBuffer
    if (entryOutputCounter == entrySize && entryCounter < podiumSize) {
      //note: not enough entries to fill the podium 
      log(`not enough entries for podium, expected ${podiumSize} but got puny ${entrySize}`)
    }
  }
  response[pageIdx+1] = `\nThanks for using battlebot! If you'd like to run another one, just run \`!newbattle letsgo\` in your battle channel :boxing_glove:`
  debug(`podium pages: ${response.length}`)
  return response
}