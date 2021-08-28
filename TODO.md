# todolist

### See the issues page for actual tasks, this is a notepad for active work

HIPRI
- results: needs to work for 0+ votes and 0+ entries
- tests: offline dev is the win here
    mock discord message, user, channel
    getenv() for user type, allows npm run testadmin/testanyone
- Deadlines output
ENTRIES: Submissions are OPEN, enter with `!submit https://your-track-link`! Submissions are due in 2 days (at August 29 at 00:00 PST)
         Submissions are CLOSED! (2 days ago at August 25 at 00:00 PST)
         Submissions are CLOSED, the deadline was 2 days ago at August 25 at 00:00 PST
VOTING: Voting happens when submissions close, and will be open for ${(subdl.to(votedl, true))}
        Voting is OPEN, run `!getballot` to vote by DM, votes are due ${now.to(votedl)} (by September 1 at 00:00 PST)
        Voting has CLOSED!

BUGS
- stopbattle and stopsubs and stopvotes should leave deadline alone if in the past
- guide update: submissions shuf[fled] to switch it up
- newbattle on empty battle is bork
- isVotingOpen should check subs are closed
- setVoteDeadline should sane-error if setting before sub deadline
- submit: subdl passed output should be smarter with votedl

TODO battlecachedao
- 100% test coverage #59

TODO battlecontroller
. results output formattign #8
. deactivate battles #57
- 100% test coverage #59
- delegate message parse to discordutil for testing easy #
- subgroovy #41
- config.handleVotingTies: alpha, chrono, expandleaderboar
    - perserver config
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
X getballot #20 formatting and output
X submissions shuffle opt instead of order
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