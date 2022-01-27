const discordutil = require('../../util/discord')
const debug = (msg) => console.log(`DISCORDROLES: ${msg}`)
const MSG_SERVER_ONLY = "this command needs to be run in a server channel where this bot is active"

//Given a rolename as input, add it to the requestor if it doesn't result in new privileges
exports.giverole = function(input, message, client) {
  if (!input.trim() || input.toLowerCase() == 'help') return `Usage: giverole 'the role name' will try to add the role to your user. Optionally, you can tag one person (after the role name) to attempt to give them the role`
  // Allows us to add a role to someone, pinging them required
  if (message.guild) {
    let expectedRoleName = input.trim()
    let requestorName = message.member.user.username
    let optionalMention = message.mentions.members.first()
    let targetMember = optionalMention ? optionalMention : message.member
    let targetName = targetMember.user.username
    const roleList = message.guild.roles.cache
    const roleToAdd = Promise.resolve(roleList.filter(role => role.name == expectedRoleName))
    debug(`Role '${expectedRoleName}' requested by ${requestorName} for ${targetName}...`)
    // TODO verify this?
    const result = Promise.resolve(targetMember.edit({
      roles: [roleToAdd]
    }))
    if(result) {
      debug(`${targetName} now has (or already had) the role ${expectedRoleName}!`)
    }else {
      // Almost certainly a permission error
      message.reply(`I can't add you to ${expectedRoleName}, probably doesn't exist or it's an admin role. Contact an admin if this is unexpected`)
      debug(`INFO: ${targetName} asked for role ${expectedRoleName} and it failed`)
    }
    return discordutil.SUCCESS
  } else {
    return MSG_SERVER_ONLY
  }
}

// List roles on the server that the bot can assign
exports.roles = exports.listroles = function(input, message, client) {
  if (input.toLowerCase() == 'help')
    return `'listroles' will get you a list of all roles on this server in a random order, this is slated for future improvement`
  // If we're on a server, get them roles - reply intelligently in unhappy circumstances
  if (message.guild) {
    const roleList = message.guild.roles.cache
                      .filter(role => !role.name.includes('@everyone'))
                      .map(role => `'${role.name}'`)
                      .sort()
                      .join(', ')
    if(roleList) {
      message.reply(`Here's all the roles, note that you cannot request superuser roles:\n${roleList}`)
    } else {
      message.reply(`Sorry but it seems there are no roles, ask a mod if this is unexpected`)
    }
    return discordutil.SUCCESS
  } else {
    return MSG_SERVER_ONLY
  }
}

//List people in a given role
exports.rolemembers = function(input = '', message, client) {
  if (!input) return `give me a role and I'll give you an answer`
  if (input.toLowerCase() == 'help') return `'rolemembers role-name' definitely doesn't list the members of a role`
  if (message.guild) {
    let role = discordutil.getRoleFromMessageGuild(input, message)
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
