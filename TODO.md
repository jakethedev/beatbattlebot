# todolist

### See the issues page for actual tasks, this is a notepad for minor things and a reminder of how far we've come
CRITICAL TODO
    ADD AUTOROLE BOT TO SERVER
    <t:UNIX> TIME REFACTOR
    feedback features (simplified)

GENERAL TODO
    notice duplicate command declarations and fail fast
    take a gander at sqlite
    add issue numbers to each of below tasks or create an issue
    function template(input, serverid, channelid)

TODO FOR util/serverdao.js
  notes
    dao-side no permission logic, that goes in controller
    call save in every change function
  () status that sends summary of all below info via dm, for mod use only
    () set, get data per server
    () initialize, sets defaults for listen, battle, podium, repeat, maxVotes, and feedbackCooldownTimer
  tiebreakMethod
    () set, get (default: chrono, options: oldest, newest, random)
  list of GIVEABLE roles in a server
    () add, remove, containsOneOf(list or obj) (default: none)
  list of mod roles in a server
    () add, remove, containsOneOf(list or obj) (default: none)
  list of listen channels in a server
    () add, remove, containsChannel(id) (default: bot, botspam?)
  list of battle channels in a server
    () add, remove, containsChannel(id) (default: any?)
  preferredTimezone
    () set, get (default: 'America/Los_Angeles')
  battlePodiumSize
    () set, get (default: 15)
  allowRepeatWinners
    () set, get (default: false)
  battleWinners
    () add, get (default: {})
  maxVotesPerBattle
    () set, get (default: 3)
  feedbackCooldownPeriod
    () set, get (default: 2 weeks, set: unimplemented error for now)

BUGS
- stopbattle and stopsubs and stopvotes should leave deadline alone if in the past
- newbattle on empty battle is bork
- isVotingOpen should check subs are closed
- stopvotes should sane-error if setting before sub deadline
- submit: subdl passed output should be smarter with votedl
- nicer output from !vote, 'votes for artist1, artist2...'

RECENTLY DONE
X discord.js 13 (since 12 unsupported) #60
X unsubmit #11
X results output formattign #8
X deactivate battles #57
X simplify stop commands #66
X getballot #20 formatting and output
X submissions shuffle opt instead of order
X con.vote #5
X switch battleName's to channel.id #25
X submissions count in output #16
X test: resetCache() to deregister all voters for battle
X test: dao.voteAndDeregister(user,entries)
X shuffle submissions output #51
X fix no-battle crashes #54
X send logic back to controller #55
X stopsubs / stopvotes shorcuts
X dao: registerVoter(user,battleName)
X dao: _deregisterVoter(user)
X FIX DEADLINES PERMISSIONS #52
X fix role issues #35
X batledata restructure (see #22 for new direction)
X BattleTestData.json
X areSubsOpen()
X areVotesOpen()
X setSubDeadline(battleName, timestamp)
X setVotingDeadline(battleName, timestamp)
X setdeadline #13, votingends #19
X deadlines cmd #18
X date formatter code in util/datefmt (pull in day.js?) #34
X format funcs:
    fmtAsPST: short PST date
X fmtAsUTC for good measure