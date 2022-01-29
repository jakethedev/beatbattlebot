const os = require('os')
const MBinB = 1048576
const rand = require('../../util/random')
const config = require('../../util/config')

//exports.
summary = function(serverid) {
  //TODO: hit util/discord util/servercachedao, format a nice report
  return `unimplemented functionality, coming soon...ish`
}

// Handy guide link for easy pinning
exports.guide = function() {
  return `Check out the **always-updated guide** on Github at ${config.guidelink}!`
}

// Simple version, bug link, and release notes output
exports.version = function() {
  let response = `I am BeatBattleBot version **${config.version}**!\n\n`
  response += `**HOW TO USE THE BOT:**\n<${config.guidelink}>\n\n`
  response += `**Release notes:**\n${config.releasenotes}\n\n`
  return response
}

exports.serverstats = function() {
  if (rand.randIntMinOne(50) == 50) {
    return rand.choice([`I have no memory of this place`, `get me out of here!`, `life's good, the kids are well. How are you?`, `there has been an anomaly`])
  } else {
    let load = os.loadavg().map((val) => val.toPrecision(2))
    let free = Math.round(os.freemem() / MBinB)
    let max = Math.round(os.totalmem() / MBinB)
    let uptime = Math.round(os.uptime() / 3600.0)
    let desire = rand.choice(['goldfish', 'new synth', 'free collab', 'repost on instagram', 'raise', 'smoothie', 'piece of cake', 'new synth plugin', 'massage', 'day off', 'new manager', 'new xlr cable', 'hammer and some balloons'])
    return `I've been awake for ${uptime} hours, my workload looks like ${load}, I've got ${free} MB free of ${max}, and I really want a ${desire} - thanks for asking.`
  }
}

