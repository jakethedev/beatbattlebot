# TODO List

## Upcoming commands: 

!getballot: CHANNEL ONLY: if voting is open, sends asker a numbered list of submissions  
!vote X [Y Z]: DM ONLY: if !getballot has been run for a battle, this places your vote for number X [and Y and Z if any are set]

Following are all MOD-ONLY:
!closebattle: sets all deadlines to the moment command was run
!closesubs [X]: set submission deadline to now [optionally: plus interval X, see `!closesubs help` for details]
!closevotes [X]: set vote deadline to now [optionally: plus interval X, see `!closevotes help` for details]
!results [X=10]: if votes have been cast, return top X beats of the battle numbered by rank (internal max of half the entries)

## Probably upcoming commands:

!votemax: Number of entries that can be voted for in a battle
!deadlines: Output the deadlines, if any
!setdeadline: a mod-only command to set a battle deadline, at which point submissions won't be accepted
!votedeadline: a mod-only command to set a voting deadline

## Mindmap of ideas that are off the roadmap

!battle: quick battle summary view, entry number and deadlines, "state" of battle?
!battlename $name: mod-only to set a battle name, should be an option at !newbattle too?
