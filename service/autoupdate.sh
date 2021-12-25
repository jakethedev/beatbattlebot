#!/bin/bash
set -xv

###################################
# Auto updater script for simple projects
#
# Set as a BOT USER cron job, with the
# correct path, and your bot will
# auto update if there's a version
# change (or any package change)
#
# Recommended cron job structure:
# */2 *  *   *   * /path/to/autoupdate.sh &> /var/log/botupdate.log
#
###################################

echo "Enterying deploy dir..."
cd /opt/deploy/beatbattlebot
echo "Backing up current package.json..."
cp package.json package.old
echo "Running update..."
git pull &> /dev/null
echo "Checking for changes and running restart..."
diff -w package.old package.json || systemctl --user restart beatbattlebot.service
echo "Update attempt complete"
