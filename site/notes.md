# Code Structure

- Adjust { ops, meta } import to static exported members instead of foreach
  - allows ops.cmd and meta.cmd autocomplete
  - may make slash commands easier to implement
- `*controller`: need to abstract discord layer from logic
  - Start with battlecontroller::submit, this is a good pattern starter
    - TODO: how to get discord account info (name, userId, channel list, mod status) from web?
    - see comment at top of function for refactor notes
  - then use logic in server.js endpoints
- Create folder for server endpoints, load each concretely in server.js
- Test a serverless-offline deployment of server.js
  - will need a handler per function? or is handler at /* sufficient?
  - less is more here, /* should work if possible
  - TODO: authentication for routes via... firebase? discord oauth?

# Design Notes

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
