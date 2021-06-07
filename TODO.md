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
- add sub count to submissions output #16
- switch battleName's to channel.id #25
X stopsubs / stopvotes shorcuts 

DONE
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