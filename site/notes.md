# New Libraries to add

webpack: build for ui, api, bot (if api needs to be diff)
Tailwind, React, Daisy
serverless-offline for testing (double check this is the right move, disc.js etc)
SQLite (libsql from Turso?)
  or postgres to go fancy mode
auth0/discord
also update engines to node20?

# Code Structure

- Commands refactor:
  - TODO: research! do slash commands have to be endpoints? Is this easier to 100% express-mode?
  - bot.index.js file that manually imports all, binds to interface that binds shared logic to discord.js api?
    - Start with battlecontroller::submit, this is a good pattern starter
      - TODO: how to get discord account info (name, userId, channel list, mod status) from web?
      - see comment at top of function for refactor notes
      - also enables express reuse if done right
    - creates map of { 'name': func }, creates closure 'hasCommandNamed', runs slash command registration
  - app.index.js manually imports all, imports express, interfaces commands to api endpoints
  - POSSIBLY Adjust { ops, meta } import to static exported members instead of foreach
    - allows ops.cmd and meta.cmd autocomplete
    - may make slash commands easier to implement
- Create folder for server endpoints, load each concretely in server.js
- Test a serverless-offline deployment of server.js
  - will need a handler per function? or is handler at /* sufficient? less is more here really
  - TODO: authentication for routes, simple custom middleware?

# Site Design Notes

App structure: React static pages
Style: Tailwind x Daisy
Auth: Firebase? Cognito? OAuth Discord?
Battle runners: Invitational? Server owners (login, get servers, can run battle for server, pick channel for bot?)
  optional bot? required bot?
Battle participants: Login with discord, can see battles in joined servers?
UI next step for:
Voting: must be better state component than redux? or is redux ok? react have light global state?
    login: default is ok if possible, sketch
    battle page: sketch
    vote page: sketch
    list battles: sketch
