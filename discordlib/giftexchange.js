const rand = require('../randomUtil')
const debug = (msg) => console.log(`GIFTEX: ${msg}`)

exports.rollthegoblins = function(input, message) {
  if (message.guild) {
    let response = `members:\n`
    let members = message.guild.defaultRole.members.filter(member => !member.user.bot).map(user => user.displayName)
    debug(`mmbrs obj: ${members}`)
    response += members.join('\n')
    return response
  } else {
    return `run this command on a server with roles to get a more helpful response :)`
  }
}
