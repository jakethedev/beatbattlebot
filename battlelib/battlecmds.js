const bcache = require('./battlecache')

let debug = msg => console.log(`battlecmds: ${msg}`)

exports.newbattle = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Usage: TODO usage info`
  }
  if (msg.guild){
    let serverName = msg.guild.name
    return bcache.emptyCache(serverName)
  } else {
    return `this command needs to be run in a server, not a dm`
  }
}

exports.submit = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Usage: TODO usage info`
  }
  if (msg.guild) {
    let requestorName = msg.member.user.username
    let serverName = msg.guild.name
    return bcache.addEntry(requestorName, input.trim(), serverName)
    // TODO delete msg, if msg.attach print Not supported yet, try bribing jake else save link
  } else {
    return `this command needs to be run in a server, not a dm`
  }
}

exports.submissions = function(input, msg) {
  if (input.toLowerCase() == 'help') {
    return `Usage: TODO usage info`
  }
  if (msg.guild) {
    let serverName = msg.guild.name
    debug(`channel, showing submissions for ${serverName}`)
    const submissionMap = bcache.getCacheForServer(serverName)
    return `TODO something more useful than this: \n\n\`\`\`${submissionMap}\`\`\``
  } else {
    debug(`dm, submissions for ${serverName}`)
    if (input) {
      let serverName = input
      return ``
    } else {
      return `Usage: TODO dm usage info`
    }
  }
}

exports.stopsubs = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: TODO usage info`
  }
  if (msg.guild) {
    let serverName = msg.guild.name
    return bcache.stopSubsForServer(serverName)
  } else {
    return `this command needs to be run in a server, not a dm`
  }
}

exports.battlevote = function(input, msg){
  if (input.toLowerCase() == 'help') {
    return `Usage: TODO usage info`
  }
  if (msg.guild) {
    let requestorName = msg.member.user.username
    let serverName = msg.guild.name
    return `here's a form with all entrants and emojis to vote on them with`
  } else {
    return `this command needs to be run in a server, not a dm`
  }
}
