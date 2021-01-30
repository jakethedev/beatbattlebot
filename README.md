# Beat Battle Bot - Discord.js Music Helper
### [Ideas and Suggestions Welcome!](https://github.com/jakethedev/beatbattlebot/issues)

## Running the bot

This bot is set up to be easy to run with systemd, check the service dir for the goods. You can run it locally with `npm run devbot` and a Discord bot token, which can be acquired at [this link](https://discordapp.com/developers/applications/me)

See the section at the bottom of this doc for current commands

## Development

Install Node.js 12+, fork this project, npm install, set up an app token (as above), add the token to a NEW file at `.token.json` in the project root, then invite the bot to a server for testing.

'npm start' will run the bot in the foreground, 'npm run devbot' will run a hot-reloading bot instance, and 'npm test' should run quietly with no issues if everything's set up correctly. 'npm run verbosetest' will show you the npm test output, which should look like Discord-formatted responses.

### Expectations and how it loads

The bot is set up to load a list of local libs, grab every exported function, and drop the functions + a bit of metadata into a global commander object. That said, this means it calls all functions exactly the same way - and if you need more parameters for some reason, perhaps we should chat. For your new commands to drop in and immediately work, they must have the following signature: `f(input:String, message:discord.js#message, client:discord.js#client)` - input will be everything after your commands name in the message to the bot (like '!commandname input is all this stuff'), the message will be the full message object [per the Discord.js api](https://discord.js.org/#/docs/main/stable/class/Message), and the client is [from Discord.js too](https://discord.js.org/#/docs/main/stable/class/Client).

### Writing new commands

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

---

## Current commands:

Run the bot and type `!help` for a full list

## Upcoming commands: 

!getballot: CHANNEL ONLY: if voting is open, sends asker a numbered list of submissions  
!vote X [Y Z]: DM ONLY: if !getballot has been run for a battle, this places your vote for number X [and Y and Z if any are set]

Following are all MOD-ONLY:
!closebattle: sets all deadlines to the moment command was run
!closesubs [X]: set submission deadline to now [optionally: plus interval X, see `!closesubs help` for details]
!closevotes [X]: set vote deadline to now [optionally: plus interval X, see `!closevotes help` for details]
!results [X=10]: if votes have been cast, return top X beats of the battle numbered by rank (internal max of half the entries)

## Probably upcoming commands:

!votemax: Number of entries that can be voted for in a battle
!deadlines: Output the deadlines, if any
!setdeadline: a mod-only command to set a battle deadline, at which point submissions won't be accepted
!votedeadline: a mod-only command to set a voting deadline

## Mindmap of ideas that are off the roadmap

!battle: quick battle summary view, entry number and deadlines, "state" of battle?
!battlename $name: mod-only to set a battle name, should be an option at !newbattle too?
