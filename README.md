# Beat Battle Bot - Discord.js Music Helper
### [Ideas and Suggestions Welcome!](https://github.com/jakethedev/beatbattlebot/issues)

## About beatbattlebot

This is a discord bot for managing beat battles, or really any other community-oriented song contests. If you're a discord mod/admin and you're looking for a quick manual or tutorial, I'll have one posted on my website (as soon as i finish upgrading the site) at jakethedev dot com. Keep an eye on this spot, I'll update it with a link when I've got one :)

## Running the bot

You can run the bot locally with `npm i; npm run devbot` and a Discord bot token, which can be acquired at [this link](https://discordapp.com/developers/applications/me). For those that want to set up a private instance, this bot is set up to be easy to run with systemd, check the service dir for some templates and a unit file. 

To see a current list of available commands, run `!help` in a bot channel or as a DM to the bot

## Development

Install Node.js 12+, fork this project, npm install, set up an app token (as above), add the token to a NEW file at `.token.json` in the project root, then invite the bot to a server for testing.

'npm start' will run the bot in the foreground, 'npm run devbot' will run a hot-reloading bot instance, and 'npm test' should run quietly with no issues if everything's set up correctly. 'npm run verbosetest' will show you the npm test output, which should look like Discord-formatted responses.

Note: battlecache.test.json may be helpful for testing, just `cp` it to battlecache.json, rename SERVER_CHANNEL1 and DIFFSERVER_CHANNEL to names appropriate for your server (e.g. "$servername\_$botchannelname", this should change to ID though: #23)

### Expectations and how it loads

The bot is set up to load a list of local libs, grab every exported function, and drop the functions + a bit of metadata into a global commander object. That said, this means it calls all functions exactly the same way - and if you need more parameters for some reason, perhaps we should chat. For your new commands to drop in and immediately work, they must have the following signature: `f(input:String, message:discord.js#message, client:discord.js#client)` - input will be everything after your commands name in the message to the bot (like '!commandname input is all this stuff'), the message will be the full message object [per the Discord.js api](https://discord.js.org/#/docs/main/stable/class/Message), and the client is [from Discord.js too](https://discord.js.org/#/docs/main/stable/class/Client).

## Writing new commands

If you just want to just *add a relevant command* to a library, you only need *step 4*. But if you have commands to add that don't seem to fit with the theme of functions in a particular file, follow all of these steps to add a new library folder to the bot:

1. Find an appropriate place to put your command - if one exists, skip to step 4, otherwise make a new directory
2. Add your new directory to the MODULES array in bot.js
3. Copy index.js from discordlib or gravemind into your new lib as a handy piece of boilerplate
4. Write exported functions in your library (Note: The bot ignores the default export!)
5. Update the index.js in your library so it loads a file you create in your new lib
6. Run it! You've now added functionality to the bot!

## Development triage:

### ImportError: no module compiler.ast:

If you see the above issue during 'npm install', just run 'sudo apt install python-dev'. I'm as upset as you are that we need python for npm, but, c'est la vie.

### Vague "app crashed" error

An issue with the bot, while testing new commands, is that you have to be very aware of what might throw an error. I don't have error handling set up correctly yet, even though I'm following the recommended client.on('error', callback) approach, so I apologize if this bites you. If you know a way to make node/discord.js run in a hella verbose way, I'd gladly add that to the `npm run devbot` script
