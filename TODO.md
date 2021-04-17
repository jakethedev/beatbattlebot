# todolist

### See the issues page for actual tasks, this is a notepad for active work

TODO battlecachedao
- 100% test coverage
    mock discord message, user, channel
- areSubsOpen()
- areVotesOpen()
- _deregisterVoter(user)
- registerVoter(user,battleName)
- setSubDeadline(battleName, timestamp)
- setVotingDeadline(battleName, timestamp)
- voteAndDeregister(user,entries)
- getResults(battleName) // should this have an option to end the battle early?
- resetCache() to deregister all voters for battle

TODO before voting
- date formatter code in util/datefmt (pull in day.js?) #34
- format funcs: 
    shortRemaining(date)
    fullTimestamp(date) // 5 Jan, 2pm PST
    default to PST, here's the note to mark a case for timezone settings per server 

TODO battlecontroller
- deal with any changes from dao
- setdeadline command #13
- votingends command #19
- deadlines cmd #18
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