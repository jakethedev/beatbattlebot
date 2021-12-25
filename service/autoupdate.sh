#!/bin/bash
set -e

###################################
# Auto updater script for simple projects
#
# Set as a BOT USER cron job, with the
# correct path, and your bot will
# auto update if there's a version
# change (or any package change)
#
# Recommended cron job structure:
# */2 *  *   *   * /path/to/autoupdate.sh >> /var/log/botupdate.log 2>> /var/log/botupdate.log
#
###################################

cd /opt/deploy/beatbattlebot
cp package.json package.old
git pull &> /dev/null
diff -w package.old package.json || systemctl --user restart beatbattlebot.service
