// ops are bot commands, meta is help TODO: and slash command data
const { ops, meta } = require('./commands')

const fs = require('fs')
const { botkey, activeChannels, gameStatus, version } = require('./util/config')
const { token } = JSON.parse(fs.readFileSync('.token.json', 'utf-8'))
const logdebug = (msg) => console.log(`[bot.js] DEBUG: ${msg}`)
const logerror = (msg) => console.error(`[bot.js] ERROR: ${msg}`)

const { Client, Intents } = require('discord.js')
const discordutil = require('./util/discord')
const client = new Client({ 
  intents: [
    // Intents.FLAGS.GUILD_MEMBERS, // Privileged
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_SCHEDULED_EVENTS
  ],
  partials: [
    'MESSAGE', // ???
    'CHANNEL', // Required to receive DMs, thanks SO
    'REACTION' // reaction roles tutorial
  ]
})

// Log instead of crash over unexpected async errors
process.on('unhandledRejection', error => {
	logdebug(`ERROR: Unhandled promise rejection: ${error}`);
});

// Simple startup callback for status and logging
client.on('ready', () => {
  if (process.env.NODE_ENV) {
    logdebug(`${process.env.NODE_ENV} mode activated!`)
  } else {
    logdebug(`NODE_ENV not set, running in dev mode`)
  }
  logdebug(`BeatBattleBot v${version} has logged in as ${client.user.tag}!`)
  client.user.setPresence({
    "status": "online",
    "game": { "name": gameStatus }
  })
})

// Handle message inputs
client.on('messageCreate', msg => {
  // Contain the bot, and ensure we actually want to act on the command
  let channelName = msg.channel.name ? msg.channel.name.toLowerCase() : "NOT_A_CHANNEL_NAME"
  if (activeChannels.includes(channelName) || msg.channel.recipient) {
    if (!msg.content.trim().startsWith(botkey) || msg.author.bot) return
    // Normalize input
    let parts = msg.content.trim().substring(1).split(/\s+/)
    let cmd = parts[0].toLowerCase()
    let input = parts[1] ? parts.slice(1).join(' ') : '' //Some cmds have no input, this lets us use if(input)
    let execTime = new Date(Date.now()).toLocaleString();
    // If we have the requested op, send it - otherwise, log it quietly
    if (cmd in ops) {
      logdebug(`INFO: ${execTime}: running ${cmd}(${input}) for ${msg.author.username}`)
      // Works for a string or a promise return. Sick. https://stackoverflow.com/a/27760489
      Promise.resolve( ops[cmd](input, msg, client) )
        .then(function(result) {
          // Quick workaround for massive responses
          if (discordutil.reactionnames.includes(result)) {
            msg.react(discordutil.emojifromname(result))
          } else if (Array.isArray(result)) {
            msg.reply(result[0])
            result.shift()
            for (const otherItem of result){
              msg.channel.send(otherItem)
            }
          } else {
            msg.reply(result)
          }
        })
        .catch(function(err) {
          msg.reply(`your command met with a terrible fate and I nearly died. Have Jake check the logs plz`)
          logdebug(`${execTime}: ERR: ${err}`)
        })
    } else if (cmd == 'help') {
      let fullHelp = `Here's the commands, type \`${botkey}oneofthecommands help\` for more details:\n`
      // Each library is a string
      for (library in meta){ // Already overloaded command, oops
        fullHelp += `\n**${meta[library].helptext}**: \n` // Set in each lib's index.js, saved at :17
        // meta[lib] is a list of ops in that lib
        for (var opName of meta[library]) {
          if ((opName) != 'helptext')
            fullHelp += `${opName}\n`
        }
      }
      fullHelp += `\nIf you notice something weird or broken, run **${botkey}feedback** for support info`
      msg.channel.send(fullHelp)
    } else {
      logdebug(`${execTime}: NOTICE: can't find ${cmd}(${input}) for ${msg.author.username}`)
      msg.react(discordutil.emojifromname('confused'))
    }
  }
});

// Turning the key and revving the bot engine
client.login(token)
