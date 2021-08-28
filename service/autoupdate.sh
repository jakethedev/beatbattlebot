#!/bin/bash
set -e

###################################
# Set as a BOT USER cron job, with the
# correct path, and your bot will
# auto update if there's a version
# change (or any package change)
#
# I set mine for every 2 minutes with a daily log cleanup. Ex:
# 
# */2 *  *   *   * /path/to/this/autoupdate.sh >> /var/log/botupdate.log 2>> /var/log/botupdate.log
# 0 2 * * * rm /var/log/botupdate.log
# 
# - jakethedev
###################################

cd /opt/deploy/beatbattlebot
cp package.json package.old
git pull &> /dev/null
diff -w package.old package.json || systemctl restart beatbattlebot
