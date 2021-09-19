# todolist

### See the issues page for actual tasks, this is a notepad for minor things and a reminder of how far we've come

BUGS
- stopbattle and stopsubs and stopvotes should leave deadline alone if in the past
- guide update: submissions shuf[fled] to switch it up
- newbattle on empty battle is bork
- isVotingOpen should check subs are closed
- setVoteDeadline should sane-error if setting before sub deadline
- submit: subdl passed output should be smarter with votedl
- nicer output from !vote, 'votes for artist1, artist2...'

DONE
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