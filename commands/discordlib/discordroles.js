const discordutil = require('../../util/discord')
const MSG_SERVER_ONLY = "this command needs to be run in a server channel where this bot is active"

//Given a rolename as input, add it to the requestor if it doesn't result in new privileges
exports.giverole = function(input, message, client) {
  if (!input.trim() || input.toLowerCase() == 'help') return `Usage: giverole 'the role name' will try to add the role to your user. Optionally, you can tag one person (after the role name) to attempt to give them the role`
  // Allows us to add a role to someone, pinging them required
  if (message.guild) {
    let expectedRoleName = input.toLowerCase().trim()
    let requestorName = message.member.user.username
    let optionalMention = message.mentions.members.first()
    let targetMember = optionalMention ? optionalMention : message.member
    let targetName = targetMember.user.username
    let roleToAdd = message.guild.roles.cache.find(role => expectedRoleName == role.name.toLowerCase())
    if (!roleToAdd){
      return `the role '${roleToAdd}' does not exist, check your spelling or reach out to a mod`
    }
    console.log(`Role '${roleToAdd.name}' requested by ${requestorName} for ${targetName}...`)
    targetMember.roles.add(roleToAdd).then(result => {
      // S'gooood. This is idempotent, adding an existing role id a-ok
      return `${targetName} now has (or already had) the role ${roleToAdd.name}!`
    }).catch(err => {
      // Almost certainly a permission error
      return `I can't add you to ${roleToAdd.name}, probably not allowed to. Contact an admin if this is unexpected`
    });
  } else {
    return MSG_SERVER_ONLY
  }
}

// List roles on the server that the bot can assign
exports.listroles = function(input, message, client) {
  if (input.toLowerCase() == 'help')
    return `'listroles' will get you a list of all roles on this server in a random order, this is slated for future improvement`
  // If we're on a server, get them roles - reply intelligently in unhappy circumstances
  if (message.guild) {
    const roleList = message.guild.roles
                      .filter(role => !role.name.includes('@everyone'))
                      .map(role => `'${role.name}'`)
                      .sort()
                      .join(', ')
    if(roleList) {
      return `here's all the roles, note that you cannot request superuser roles:\n${roleList}`
    } else {
      return `seems there are no roles, ask a mod if this is unexpected`
    }
  } else {
    return MSG_SERVER_ONLY
  }
}

//List people in a given role
exports.rolemembers = function(input = '', message, client) {
  if (!input) return `give me a role and I'll give you an answer`
  if (input.toLowerCase() == 'help') return `'rolemembers role-name' definitely doesn't list the members of a role`
  if (message.guild) {
    let role = getGuildRole(input, message)
    if (role && role.members.size) {
      let roleMemberList = role.members.map(m => m.displayName).join(', ')
      return `${role.name} has the following members:\n${roleMemberList}`
    } else if (role) {
      return `${role.name} is a quiet, empty place with no members`
    } else {
      return `role '${input}' not found - I need the role's full name to get you a roll call`
    }
  } else {
    return MSG_SERVER_ONLY
  }
}

////////////////////////////
// Internal Helper Functions
////////////////////////////

// Takes in the name of a role and a discord message
function getGuildRole(input, message) {
  input = input.trim().toLowerCase()
  return message.guild.roles.find(role => role.name.toLowerCase() === input)
}
