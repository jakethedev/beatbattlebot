const bcache = require('./battlecache')

exports.newbattle = function(input, msg, client) {
  if (input.toLowerCase() == 'help') {
    return `Usage: TODO usage info`
  }
  // TODO name with input, or give neat codename
  bcache.emptyCache()
  return `A NEW BATTLE HAS BEGUN!`
}

exports.submit = function(input, msg, client) {
  if (input.toLowerCase() == 'help') {
    return `Usage: TODO usage info`
  }
  if (msg.guild) {
    // TODO delete msg, if msg.attach print Not supported yet, try bribing jake else save link
    let requestorName = msg.member.user.username
    bcache.addEntry(requestorName, input.trim())
    return `your entry has been recorded (${bcache.entryMap.size} entries total)!`
  } else {
    return `this command needs to be run in a server, not a dm`
  }
}

exports.submissions = function(input, msg, client) {
  if (input.toLowerCase() == 'help') {
    return `Usage: TODO usage info`
  }
  if (input === 'channel'){
    return `channel output, `
  } else {
    return `dm output`
  }
}

exports.stopsubs = function(input, msg, client){
  if (input.toLowerCase() == 'help') {
    return `Usage: TODO usage info`
  }
  return `submissions are CLOSED! (jk this is not )`
}

exports.battlevote = function(input, msg, client){
  if (input.toLowerCase() == 'help') {
    return `Usage: TODO usage info`
  }
  return `here's a form with all entrants and emojis to vote on them with`
}
