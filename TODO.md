# todolist

### See the issues page for actual tasks, this is a notepad for active work

TODO battlecachedao
- 100% test coverage
    mock discord message, user, channel
- areSubsOpen()
- areVotesOpen()
- _deregisterVoter(user)
- registerVoter(user,battleName)
X setSubDeadline(battleName, timestamp)
X setVotingDeadline(battleName, timestamp)
- voteAndDeregister(user,entries)
- getResults(battleName) // should this have an option to end the battle early?
- resetCache() to deregister all voters for battle

TODO before voting
- date formatter code in util/datefmt (pull in day.js?) #34
X format funcs: 
    fmtAsPST: short PST date

TODO battlecontroller
- deal with any changes from dao
. setdeadline #13, votingends #19
    clean up input better
    ensure setting to future/less than a year from now
X deadlines cmd #18
- getballot #20
    this is gonna be a chunky one
- results #8
- vote #5
- add sub count to submissions output #16
- switch battleName's to channel.id #25
- stopsubs / stopvotes shorcuts 

DONE
- fix role issues #35
- batledata restructure (see #22 for new direction)
- BattleTestData.json