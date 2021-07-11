# todolist

### See the issues page for actual tasks, this is a notepad for active work

TODO battlecachedao
- 100% test coverage
    mock discord message, user, channel
- voteAndDeregister(user,entries)
- getResults(battleName) // should this have an option to end the battle early?
- resetCache() to deregister all voters for battle

TODO battlecontroller
. vote #5
. getballot #20
    this is gonna be a chunky one
. results #8
- subgroovy #41
- modsubmit 
- shuffle submissions output #51
  submissions count in output #16
- sumbissions #53
- add sub count to submissions output #16
- switch battleName's to channel.id #25
- !rules 'msg' #47
- !globalwinners !champions #50 #48
- !battle summary cmd #32
- begonebot/heylisten #31/#30
- !botmod #49
- discordutil.ispowerful roles #15

DONE
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