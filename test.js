/*
Note to any readers:

I don't, for one second, think this is a substitute for unit testing.
I just wanted a way to continue bolting down code and ensuring it all
works smoothly during intense construction and refactoring, and this
is surprisingly maintainable for the moment.

When it gets hairy, I'll bring on chai + mocha. Which will probably be soon.
*/


const battlelib = require('./battlelib')
const discordlib = require('./discordlib')
require('./randomUtil')
const {
  token,
  botkey,
  botRole,
  activeChannels,
  gameStatus
} = require("./config.json")

// Example mock message for testing from my dnd bot that uses this same approach
let msgs = [
  { "content": "!newbattle", "author": { 'username': "jake" }, "reply": console.log, "channel": { "name": "bot" } },
  { "content": "!submit https://my.song", "author": { 'username': "jake" }, "reply": console.log, "channel": { "name": "bot" } }
]

for (msg of msgs) {
  // Let's hook it up for a default channel and DMs
  if (activeChannels.includes(msg.channel.name.toLowerCase()) || msg.channel.recipient) {
    //Make sure we care, and that we're not making ourselves care
    if (!msg.content.trim().startsWith(botkey) || msg.author.bot) return
    //Remove botkey and break it up into clean not-mixed-cased parts.
    let parts = msg.content.trim().toLowerCase().substring(1).split(/\s+/)
    let cmd = parts[0]
    let input = parts[1] ? parts.slice(1).join(' ') : '' //Some cmds have no input, this lets us use if(input)
    let execTime = new Date(Date.now()).toLocaleString() + ': ';
    //From here, we check each lib until we find a match for execution, or we let the user know it's a no-go
    if (cmd in battlelib) {
      console.log(execTime + 'running battlelib.' + cmd + '(' + input + ') for ' + msg.author.username)
      msg.reply(dungeonary[cmd](input))
    } else if (cmd in discordlib) {
      console.log(execTime + 'running discordlib.' + cmd + '(' + input + ') for ' + msg.author.username)
      msg.reply(discordlib[cmd](input, msg, client))
    } else {
      msg.reply("I'm sorry " + msg.author.username + ", I'm afraid I can't do that")
    }
  }
}
