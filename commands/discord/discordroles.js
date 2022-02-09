const constants = require('../../util/constants')
const discordutil = require('../../util/discord')
const debug = (msg) => console.log(`DISCORDROLES: ${msg}`)

exports.reactrole = function(input, message) {
  /*
  const { messageContent, roleToAdd } = discurdutil.parseReactRoleObjectFrom(input)
  reactmsgid = message.channel ? message.channel.send(messageContent) : return "NO DM ONLY THROW"
  servercache.addReactMessageWatch(message.guild.id, reactmsgid, roleToAdd.id)
  return good

  BOT.JS
  client.on('messageReactionAdd', (reaction, user) => {
    const msgid = reaction.message.id
    const guildid = reaction.message.guild.id
    // TODO rename this to be reactRoleID
    const reactRoleId = servercache.getGuildRoleIDForReaction(guildid, msgid)
    if (reactRoleId) {
      const roleToAdd = user.guild.roles.find(id = reactRoleId)
      try {
        user.roles.add(roleToAdd)
        reply(success)
      } catch (e) {
        debug('fuck')
      }
    }
  }) 
  */
}
// exports.rr = exports.reactrole

//Given a rolename as input, add it to the requestor if it doesn't result in new privileges
exports.giverole = function(input, message, client) {
  if (!input.trim() || input.toLowerCase() == 'help') return `Usage: giverole 'the role name' will try to add the role to your user. Optionally, you can tag one person (after the role name) to attempt to give them the role`
  // Allows us to add a role to someone, pinging them required
  if (message.guild) {
    let rolename = input.trim()
    let roleToAdd = discordutil.getRoleFromMessageGuild(rolename, message)
    let requestorName = message.member.user.username
    let optionalMention = message.mentions.members.first()
    let targetMember = optionalMention ? optionalMention : message.member
    let targetName = targetMember.user.username
    debug(`Role '${rolename}' requested by ${requestorName} for ${targetName}...`)
    targetMember.roles.add(roleToAdd).then(result => {
      // console.dir(result._roles)
      message.reply(`${targetName} is in ${rolename}!`)
    }).catch(err => {
      // Permission error or role does not exist
      message.reply(`I can't add you to ${rolename}, probably doesn't exist or it's an admin role. Contact an admin if this is unexpected`)
      debug(`INFO: ${targetName} asked for role ${rolename} and it failed`)
    })
    return discordutil.LOADING
  } else {
    return constants.MSG_SERVER_ONLY
  }
}

// List roles on the server that the bot can assign
exports.roles = exports.listroles = function(input, message, client) {
  if (input.toLowerCase() == 'help')
    return `Usage: '!roles' will get you a list of all roles on this server in a random order, this is slated for future improvement`
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
    return constants.MSG_SERVER_ONLY
  }
}

//List people in a given role
rolemembers = function(input = '', message, client) {
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
    return constants.MSG_SERVER_ONLY
  }
}
