// Relies on discord permission scheme: https://discord.com/developers/docs/topics/permissions
class DiscordUtil {

  isPowerfulMember(discordJsMsg) {
    const isAdmin = discordJsMsg.member.permissions.any(['ADMINISTRATOR', 'MANAGE_CHANNELS'])
    //TODO: const hasBotRole = msg.member.roles.any()
    return isAdmin // || hasBotRole
  }

}

exports.DiscordUtil = DiscordUtil