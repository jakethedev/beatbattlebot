# todolist

fix voting, it sucks
```
!vote usernameFuzzySearch, user2, ... userX
  voteIds = [], notFound = [], multiMatch = []
  foreach name:
    matches = entries.findSome(name)
    if matches.length === 1
      voteIds.push(match[0].id)
    else if matches.length === 0
      notFound.push(name)
    else // multiple matches
      multiMatch.push(name)
  response = `some useful header`;
  if (voteIds.length)
    saveVote(msg.author.id, battleId, voteIds)
  if (notFound.length)
    response += `not found: ${...notfound}`
  if (multiMatch.length)
    response += `multiple matches found for: ${...multiMatch}`
  reply(response);
```
website REALLY fixes it js

### See the issues page for actual tasks, this is a notepad for minor things and a reminder of recent dubs
Feedback priority tasks:
  reset empties queue
    ✔ reset(chanid)
  notes standalone
    ✔ saveNotesForUser(chanid, user, notes)
  submit link [notes]
    ✔ saveLinkForUser(chanid, user, link) // TIMESTAMP HERE
  go v1 get a user, delete from queue
    ✔ getSingleFeedbackEntry(chanid)

Feedback second priority:
  !fb go v2 if (last queued user) cooldown(last q user) queue new user
  ✔ getSelectionMethodForChannel(chanid)
  ✔ setSelectionMethodForChannel(chanid, str)
  !fb skip: dequeue last queued user, handle "skipped" entries, clear "skipped" on !fb done
  !fb done: empty queue to cooldown
  !fb cooldown span if parsespan: else return current span and usage
  ✔ getCooldownTimeForChannel(chanid)
  ✔ setCooldownTimeForChannel(chanid, str)
  ✔ isUserInCooldown(chanid, user) // STUB
  ✔ queueUserForCooldown(chanid, user) // STUB
  ✔ commitCooldownQueue(chanid) // STUB
  ✔ removeUserFromCooldownQueue(chanid, user) // STUB


STUBBED FOR LATER
  !fb open
  !fb close
  ✔ isOpenForFeedback(chanid)
  ✔ openChannelForFeedback(chanid)
  ✔ closeChannelForFeedback(chanid)

NEXT
  <t:UNIX> TIME REFACTOR #92
  showcase features copied wholesale from PoC

IMPORTANT
  reactrole feature thanks to tutorial, servercache for config
  Issue for util/msg_util.js: msg_util.isModMsg, msg_util.isChannelMsg, abstract some shit
  Issue for util/constants.js `const constants = require('./util/constants')`
  Issue for refactoring `if (msg.guild)` into some metadata structure
  Issue for refactoring `if (util.isPowerfulSender(msg))` into some metadata structure for bot.js to simplify
  ^ this solves the help crisis too

GENERAL TODO
  notice duplicate command declarations and fail fast
  take a gander at sqlite

TODO FOR util/serverdao.js
  dao-side no permission logic, that goes in controller
  call save in every change function
() status that sends summary of all below info via dm, for mod use only
  () set, get data per server
  () initialize, sets defaults for listen, battle, podium, repeat, maxVotes, and feedbackCooldownTimer

BUGS
- stopbattle and stopsubs and stopvotes should leave deadline alone if in the past
- newbattle on empty battle was bork?
- isVotingOpen should check subs are closed
- stopvotes should sane-error if setting before sub deadline

RECENTLY DONE
X test mock objects are dope now
X discord.js 13 (since 12 unsupported) #60
X unsubmit #11
X results output formattign #8
X deactivate battles #57
X simplify stop commands #66
X getballot #20 formatting and output
X submissions shuffle opt instead of order
X con.vote #5
X switch battleName's to channel.id #25
