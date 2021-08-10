# todolist

### See the issues page for actual tasks, this is a notepad for active work

HIPRI
- results: needs to work for 0+ votes and 0+ entries
- ballot: output needs written

BUGS
_ getballot needs to respect isVotingOpen
- newbattle on empty battle is bork
- isVotingOpen should check subs are closed
- setVoteDeadline should sane-error if setting before sub deadline
- submit: subdl passed output should be smarter with votedl

TODO battlecachedao
. podium(x) response
- 100% test coverage
    mock discord message, user, channel
- getResults(battleName) // should this have an option to end the battle early?

TODO battlecontroller
. getballot #20 formatting and output
. results output formattign #8
- subgroovy #41
. deactivate battles #57
- begonebot/heylisten #31/#30
- newbattle: if input, setDeadline(input)
- discordutil.ispowerful roles #15
- !votemax NUM #33
- !rules 'msg' #47
- !battle summary cmd #32
- !globalwinners !champions #50 #48
- !botmod #49
- modsubmit 
- sumbissions #53
- nicer output from !vote, 'votes for artist1, artist2...'

NEEDS TESTING
X resetCache() to deregister all voters for battle
X dao.voteAndDeregister(user,entries)

DONE
X con.vote #5
X switch battleName's to channel.id #25
X submissions count in output #16
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