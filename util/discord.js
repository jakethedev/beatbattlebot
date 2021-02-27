// Relies on discord permission scheme: https://discord.com/developers/docs/topics/permissions
exports.isPowerfulMember = function(discordJsMsg){
  const isAdmin = discordJsMsg.member.permissions.any(['ADMINISTRATOR', 'MANAGE_CHANNELS'])
  //TODO: const hasBotRole = msg.member.roles.any()
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
  'heart': '�'
}

const reactionkeys = Object.keys(reactionmap)

exports.reactionnames = reactionkeys
exports.emojifromname = (name) => reactionmap[name]
// Autocomplete doesn't work right anyways, so here's some constants for easy access
for (let key of reactionkeys){
  exports[key.toUpperCase()] = key
}