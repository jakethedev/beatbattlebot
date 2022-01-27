// Core bot setup
const fs = require('fs')
const debug = (msg) => console.log(`MAIN: ${msg}`)
// Config
const { botkey, activeChannels, gameStatus } = require('./util/config')
const { token } = JSON.parse(fs.readFileSync('.token.json', 'utf-8'))
// Instantiating the manifold
const { Client, Intents } = require('discord.js')
const discordutil = require('./util/discord')
const { ops, meta } = require('./commands')
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
      'CHANNEL', // Required to receive DMs, thanks SO
  ]
})

// In case something happens, we'll want to see logs
client.on("error", (e) => console.error(e))

// Startup callback
client.on('ready', () => {
  if (process.env.NODE_ENV) {
    console.log(`${process.env.NODE_ENV} mode activated!`)
  } else {
    console.log(`NODE_ENV not set, running in dev mode`)
  }
  console.log(`BeatBattleBot v${process.env.npm_package_version} has logged in as ${client.user.tag}!`)
  client.user.setPresence({
    "status": "online",
    "game": { "name": gameStatus }
  })
})

// Command central
client.on('message', msg => {
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
      console.log(execTime + ': running ' + cmd + '(' + input + ') for ' + msg.author.username)
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
          console.log(`${execTime}: ERR: ${err}`)
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
      console.log(`${execTime}: NOTICE: can't find ${cmd}(${input}) for ${msg.author.username}`)
    }
  }
});

// Turning the key and revving the bot engine
client.login(token)
